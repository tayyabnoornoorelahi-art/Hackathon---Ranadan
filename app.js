
        // ==================== DATA ====================
        let users = [
            { id: 1, email: 'admin@demo.com', password: 'admin123', name: 'Admin Bhai', role: 'admin' },
            { id: 2, email: 'doctor@demo.com', password: 'doctor123', name: 'Dr. Sharma', role: 'doctor' },
            { id: 3, email: 'reception@demo.com', password: 'reception123', name: 'Priya Reception', role: 'receptionist' },
            { id: 4, email: 'patient@demo.com', password: 'patient123', name: 'Rahul Patient', role: 'patient' }
        ];
        
        const patients = [
            { id: 1, name: 'Rahul Kumar', age: 35, gender: 'Male', phone: '9876543210', blood: 'B+' },
            { id: 2, name: 'Priya Singh', age: 28, gender: 'Female', phone: '9876543211', blood: 'O+' },
            { id: 3, name: 'Amit Sharma', age: 45, gender: 'Male', phone: '9876543212', blood: 'A+' },
            { id: 4, name: 'Neha Gupta', age: 32, gender: 'Female', phone: '9876543213', blood: 'AB+' }
        ];
        
        let appointments = [
            { id: 1, patientId: 1, doctorId: 2, date: '2026-03-05', time: '10:00', status: 'confirmed', symptoms: 'Fever, cough' },
            { id: 2, patientId: 2, doctorId: 2, date: '2026-03-05', time: '11:30', status: 'pending', symptoms: 'Headache' },
            { id: 3, patientId: 3, doctorId: 2, date: '2026-03-06', time: '09:00', status: 'confirmed', symptoms: 'Regular checkup' },
            { id: 4, patientId: 4, doctorId: 2, date: '2026-03-06', time: '14:30', status: 'pending', symptoms: 'Stomach pain' }
        ];
        
        let prescriptions = [
            { id: 1, patientId: 1, doctorId: 2, diagnosis: 'Viral Fever', medicines: 'Paracetamol 500mg - 2 times daily', instructions: 'Take after meals for 3 days', date: '2026-03-05' },
            { id: 2, patientId: 2, doctorId: 2, diagnosis: 'Migraine', medicines: 'Sumatriptan 50mg - as needed', instructions: 'Take at onset of headache', date: '2026-03-04' }
        ];
        
        let currentUser = null;
        let selectedRole = null;
        
        // ==================== ROLE SELECTION ====================
        function selectRole(role) {
            selectedRole = role;
            
            // Remove selected class from all
            document.querySelectorAll('.role-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked
            document.querySelector(`[data-role="${role}"]`).classList.add('selected');
        }
        
        function fillDemo(role) {
            selectRole(role);
            
            const demoNames = {
                'admin': 'Admin Bhai',
                'doctor': 'Dr. Sharma',
                'receptionist': 'Priya Reception',
                'patient': 'Rahul Patient'
            };
            
            const demoEmails = {
                'admin': 'admin@demo.com',
                'doctor': 'doctor@demo.com',
                'receptionist': 'reception@demo.com',
                'patient': 'patient@demo.com'
            };
            
            document.getElementById('username').value = demoNames[role];
            document.getElementById('email').value = demoEmails[role];
            document.getElementById('password').value = role + '123';
        }
        
        // ==================== AUTH ====================
        function handleLogin(event) {
            event.preventDefault();
            
            const name = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            if (!name || !email || !password) {
                showToast('Please fill all fields!', 'error');
                return;
            }
            
            if (!selectedRole) {
                showToast('Please select a role!', 'error');
                return;
            }
            
            // Show loading
            document.getElementById('loading').classList.add('active');
            
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Check if user exists
                    let user = users.find(u => u.email === email);
                    
                    if (user) {
                        // User exists - verify password
                        if (user.password !== password) {
                            hideLoading();
                            showToast('Invalid password!', 'error');
                            return;
                        }
                    } else {
                        // Create new user
                        user = {
                            id: users.length + 1,
                            email: email,
                            password: password,
                            name: name,
                            role: selectedRole
                        };
                        users.push(user);
                        showToast('Account created successfully!', 'success');
                    }
                    
                    // Set current user
                    currentUser = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // Hide loading and show dashboard
                    hideLoading();
                    
                    document.getElementById('loginPage').style.display = 'none';
                    document.getElementById('dashboard').classList.add('active');
                    
                    document.getElementById('userNameDisplay').textContent = user.name;
                    document.getElementById('userRole').textContent = user.role;
                    
                    loadMenu();
                    loadDashboard();
                    
                    showToast(`Welcome ${user.name}!`, 'success');
                    
                } catch (error) {
                    hideLoading();
                    showToast('Something went wrong!', 'error');
                    console.error(error);
                }
            }, 1000);
        }
        
        function logout() {
            currentUser = null;
            selectedRole = null;
            localStorage.removeItem('user');
            
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById('loginPage').style.display = 'flex';
            
            // Reset form
            document.getElementById('username').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('selected'));
            
            showToast('Logged out successfully!', 'success');
        }
        
        // ==================== MENU ====================
        function loadMenu() {
            const menu = document.getElementById('sidebar');
            const role = currentUser.role;
            
            let menuItems = [];
            
            if (role === 'admin') {
                menuItems = [
                    { icon: 'chart-pie', text: 'Dashboard' },
                    { icon: 'user-md', text: 'Doctors' },
                    { icon: 'user-injured', text: 'Patients' },
                    { icon: 'calendar-check', text: 'Appointments' },
                    { icon: 'chart-line', text: 'Analytics' },
                    { icon: 'crown', text: 'Subscriptions' }
                ];
            } else if (role === 'doctor') {
                menuItems = [
                    { icon: 'chart-pie', text: 'Dashboard' },
                    { icon: 'calendar-check', text: 'Appointments' },
                    { icon: 'users', text: 'My Patients' },
                    { icon: 'robot', text: 'AI Diagnosis' },
                    { icon: 'prescription', text: 'Prescriptions' },
                    { icon: 'chart-line', text: 'My Analytics' }
                ];
            } else if (role === 'receptionist') {
                menuItems = [
                    { icon: 'chart-pie', text: 'Dashboard' },
                    { icon: 'user-plus', text: 'Register Patient' },
                    { icon: 'calendar-check', text: 'Appointments' },
                    { icon: 'list', text: 'Patient List' }
                ];
            } else if (role === 'patient') {
                menuItems = [
                    { icon: 'chart-pie', text: 'Dashboard' },
                    { icon: 'heartbeat', text: 'My Health' },
                    { icon: 'prescription', text: 'My Prescriptions' },
                    { icon: 'calendar-plus', text: 'Book Appointment' }
                ];
            }
            
            menu.innerHTML = menuItems.map(item => `
                <div class="menu-item" onclick="loadView('${item.text}')">
                    <i class="fas fa-${item.icon}"></i>
                    <span>${item.text}</span>
                </div>
            `).join('');
            
            // Activate first menu item
            if (menu.firstChild) {
                menu.firstChild.classList.add('active');
            }
        }
        
        // ==================== VIEWS ====================
        function loadView(view) {
            // Remove active class from all menu items
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            if (event && event.target) {
                const menuItem = event.target.closest('.menu-item');
                if (menuItem) menuItem.classList.add('active');
            }
            
            switch(view) {
                case 'Dashboard': loadDashboard(); break;
                case 'Appointments': loadAppointments(); break;
                case 'Patients': loadPatients(); break;
                case 'My Patients': loadPatients(); break;
                case 'Patient List': loadPatients(); break;
                case 'Register Patient': showRegisterPatient(); break;
                case 'AI Diagnosis': loadAIDiagnosis(); break;
                case 'Prescriptions': loadPrescriptions(); break;
                case 'My Prescriptions': loadPatientPrescriptions(); break;
                case 'My Health': loadPatientHealth(); break;
                case 'Book Appointment': showBookAppointment(); break;
                case 'Analytics': loadAnalytics(); break;
                case 'My Analytics': loadAnalytics(); break;
                case 'Doctors': loadDoctors(); break;
                case 'Subscriptions': loadSubscriptions(); break;
                default: loadDashboard();
            }
        }
        handleLogin()
        function loadDashboard() {
            const content = document.getElementById('content');
            
            const todayApps = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
            const pendingApps = appointments.filter(a => a.status === 'pending').length;
            const completedApps = appointments.filter(a => a.status === 'completed').length;
            
            content.innerHTML = `
                <div class="welcome-message">
                    <h2><i class="fas fa-hand-wave"></i> Welcome back, ${currentUser.name}!</h2>
                    <p>You are logged in as <strong>${currentUser.role}</strong>. Here's your overview for today.</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Patients</h3>
                        <div class="stat-number">${patients.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Today's Appointments</h3>
                        <div class="stat-number">${todayApps}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Pending</h3>
                        <div class="stat-number">${pendingApps}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Completed</h3>
                        <div class="stat-number">${completedApps}</div>
                    </div>
                </div>
                
                <div class="table-container">
                    <h3 style="margin-bottom: 20px;">Recent Appointments</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appointments.slice(0, 5).map(a => {
                                const patient = patients.find(p => p.id === a.patientId);
                                const doctor = users.find(u => u.id === a.doctorId);
                                return `
                                    <tr>
                                        <td>${patient?.name || 'Unknown'}</td>
                                        <td>${doctor?.name || 'Unknown'}</td>
                                        <td>${a.date}</td>
                                        <td>${a.time}</td>
                                        <td><span class="status ${a.status}">${a.status}</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        function loadAIDiagnosis() {
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <div class="ai-card">
                    <h2><i class="fas fa-robot"></i> AI Symptom Checker</h2>
                    <p>Enter symptoms for AI-powered diagnosis and risk assessment</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 15px;">
                    <div class="form-group">
                        <label><i class="fas fa-notes-medical"></i> Symptoms (comma separated)</label>
                        <input type="text" id="symptoms" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" value="fever, cough, headache" placeholder="e.g., fever, cough, chest pain">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                        <div class="form-group">
                            <label><i class="fas fa-calendar"></i> Age</label>
                            <input type="number" id="age" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" value="35">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-venus-mars"></i> Gender</label>
                            <select id="gender" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" onclick="analyzeSymptoms()" style="width: 100%;">
                        <i class="fas fa-microscope"></i> Analyze Symptoms
                    </button>
                    
                    <div id="aiResult" style="display: none; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #667eea;"></div>
                </div>
            `;
        }
        
        function analyzeSymptoms() {
            const symptoms = document.getElementById('symptoms').value.toLowerCase();
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            
            let conditions = [];
            let riskLevel = 'low';
            let tests = [];
            let advice = '';
            
            // AI logic
            if (symptoms.includes('fever') && symptoms.includes('cough')) {
                conditions = ['Viral Fever', 'Upper Respiratory Infection', 'COVID-19 (possible)'];
                riskLevel = age > 60 ? 'high' : 'medium';
                tests = ['CBC', 'Chest X-ray', 'COVID Test'];
                advice = 'Isolate yourself until test results. Use paracetamol for fever.';
            } else if (symptoms.includes('chest pain') || symptoms.includes('heart')) {
                conditions = ['Angina', 'Heart Attack (emergency)', 'GERD'];
                riskLevel = 'high';
                tests = ['ECG', 'Troponin', 'ECHO'];
                advice = 'EMERGENCY: Go to hospital immediately!';
            } else if (symptoms.includes('headache') && symptoms.includes('nausea')) {
                conditions = ['Migraine', 'Tension Headache', 'Sinusitis'];
                riskLevel = 'medium';
                tests = ['Neurological exam', 'CT scan if severe'];
                advice = 'Rest in dark room, avoid screen time.';
            } else if (symptoms.includes('diabetes') || symptoms.includes('sugar')) {
                conditions = ['Type 2 Diabetes', 'Pre-diabetes'];
                riskLevel = 'medium';
                tests = ['Fasting Blood Sugar', 'HbA1c'];
                advice = 'Monitor blood sugar, avoid sweets.';
            } else {
                conditions = ['General Malaise', 'Stress-related symptoms'];
                riskLevel = 'low';
                tests = ['Basic blood work', 'Vitamin levels'];
                advice = 'Rest well, stay hydrated.';
            }
            
            const resultDiv = document.getElementById('aiResult');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <h4 style="margin-bottom: 15px; color: #0b2f4e;">
                    <i class="fas fa-robot"></i> AI Analysis Result
                </h4>
                
                <div style="margin-bottom: 15px;">
                    <strong>Possible Conditions:</strong>
                    <ul style="margin-top: 5px; margin-left: 20px;">
                        ${conditions.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
                
                <p><strong>Risk Level:</strong> 
                    <span class="risk-${riskLevel}">${riskLevel.toUpperCase()}</span>
                </p>
                
                <p><strong>Suggested Tests:</strong> ${tests.join(', ')}</p>
                
                <div style="margin-top: 15px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
                    <strong><i class="fas fa-heartbeat"></i> Doctor's Advice:</strong>
                    <p style="margin-top: 5px;">${advice}</p>
                </div>
                
                <p style="margin-top: 20px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
                    <i class="fas fa-info-circle"></i> This is AI-generated preliminary advice. Please consult a doctor for final diagnosis.
                </p>
            `;
        }
        
        function loadAppointments() {
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Appointments</h2>
                
                ${currentUser.role === 'doctor' || currentUser.role === 'receptionist' ? `
                    <div style="margin-bottom: 20px;">
                        <button class="btn btn-primary" onclick="showNewAppointment()">
                            <i class="fas fa-plus"></i> New Appointment
                        </button>
                    </div>
                ` : ''}
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Symptoms</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appointments.map(a => {
                                const patient = patients.find(p => p.id === a.patientId);
                                const doctor = users.find(u => u.id === a.doctorId);
                                return `
                                    <tr>
                                        <td>${patient?.name || 'Unknown'}</td>
                                        <td>${doctor?.name || 'Unknown'}</td>
                                        <td>${a.date}</td>
                                        <td>${a.time}</td>
                                        <td>${a.symptoms}</td>
                                        <td><span class="status ${a.status}">${a.status}</span></td>
                                        <td>
                                            ${currentUser.role === 'doctor' ? `
                                                <button class="btn btn-primary btn-sm" onclick="updateStatus(${a.id})">
                                                    Update
                                                </button>
                                            ` : ''}
                                            ${currentUser.role === 'receptionist' ? `
                                                <button class="btn btn-danger btn-sm" onclick="cancelAppointment(${a.id})">
                                                    Cancel
                                                </button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        function loadPatients() {
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Patient Directory</h2>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Blood Group</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patients.map(p => `
                                <tr>
                                    <td>${p.name}</td>
                                    <td>${p.age}</td>
                                    <td>${p.gender}</td>
                                    <td>${p.phone}</td>
                                    <td>${p.blood}</td>
                                    <td>
                                        <button class="btn btn-primary btn-sm" onclick="viewPatientHistory(${p.id})">
                                            <i class="fas fa-history"></i> History
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        function showRegisterPatient() {
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Register New Patient</h2>
                <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px;">
                    <div class="form-group">
                        <label><i class="fas fa-user"></i> Full Name</label>
                        <input type="text" id="patName" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" placeholder="Enter patient name">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label><i class="fas fa-calendar"></i> Age</label>
                            <input type="number" id="patAge" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" placeholder="Age">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-venus-mars"></i> Gender</label>
                            <select id="patGender" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-phone"></i> Phone Number</label>
                        <input type="text" id="patPhone" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" placeholder="Phone number">
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-tint"></i> Blood Group</label>
                        <select id="patBlood" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>O+</option>
                            <option>O-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-map-marker-alt"></i> Address</label>
                        <textarea id="patAddress" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" rows="3" placeholder="Address"></textarea>
                    </div>
                    <button class="btn btn-primary" onclick="registerPatient()" style="width: 100%;">
                        <i class="fas fa-save"></i> Register Patient
                    </button>
                </div>
            `;
        }
        
        function registerPatient() {
            const name = document.getElementById('patName').value.trim();
            const age = document.getElementById('patAge').value;
            const gender = document.getElementById('patGender').value;
            const phone = document.getElementById('patPhone').value.trim();
            const blood = document.getElementById('patBlood').value;
            
            if (!name || !age || !phone) {
                showToast('Please fill required fields!', 'error');
                return;
            }
            
            const newPatient = {
                id: patients.length + 1,
                name: name,
                age: parseInt(age),
                gender: gender,
                phone: phone,
                blood: blood,
                address: document.getElementById('patAddress').value
            };
            
            patients.push(newPatient);
            showToast('Patient registered successfully!', 'success');
            loadPatients();
        }
        
        function showBookAppointment() {
            const doctors = users.filter(u => u.role === 'doctor');
            
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Book New Appointment</h2>
                <div style="background: white; padding: 30px; border-radius: 15px; max-width: 600px;">
                    <div class="form-group">
                        <label><i class="fas fa-user-md"></i> Select Doctor</label>
                        <select id="appDoctor" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                            ${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                        </select>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label><i class="fas fa-calendar"></i> Date</label>
                            <input type="date" id="appDate" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" value="2026-03-10">
                        </div>
                        <div class="form-group">
                            <label><i class="fas fa-clock"></i> Time</label>
                            <input type="time" id="appTime" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" value="10:00">
                        </div>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-notes-medical"></i> Symptoms/Reason</label>
                        <textarea id="appSymptoms" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" rows="3" placeholder="Describe your symptoms"></textarea>
                    </div>
                    <button class="btn btn-primary" onclick="bookAppointment()" style="width: 100%;">
                        <i class="fas fa-calendar-check"></i> Book Appointment
                    </button>
                </div>
            `;
        }
        
        function bookAppointment() {
            const doctorId = document.getElementById('appDoctor').value;
            const date = document.getElementById('appDate').value;
            const time = document.getElementById('appTime').value;
            const symptoms = document.getElementById('appSymptoms').value.trim();
            
            if (!symptoms) {
                showToast('Please describe symptoms!', 'error');
                return;
            }
            
            const newAppointment = {
                id: appointments.length + 1,
                patientId: 1, // For demo, using first patient
                doctorId: parseInt(doctorId),
                date: date,
                time: time,
                status: 'pending',
                symptoms: symptoms
            };
            
            appointments.push(newAppointment);
            showToast('Appointment booked successfully!', 'success');
            loadView('Dashboard');
        }
        
        function loadPrescriptions() {
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Prescriptions</h2>
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="showNewPrescription()">
                        <i class="fas fa-plus"></i> New Prescription
                    </button>
                </div>
                ${prescriptions.map(p => {
                    const patient = patients.find(pat => pat.id === p.patientId);
                    const doctor = users.find(doc => doc.id === p.doctorId);
                    return `
                        <div class="prescription-card">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <h4><i class="fas fa-user"></i> ${patient?.name || 'Unknown'}</h4>
                                <span class="status confirmed">${p.date}</span>
                            </div>
                            <p><strong>Doctor:</strong> ${doctor?.name || 'Unknown'}</p>
                            <p><strong>Diagnosis:</strong> ${p.diagnosis}</p>
                            <p><strong>Medicines:</strong> ${p.medicines}</p>
                            <p><strong>Instructions:</strong> ${p.instructions}</p>
                            <button class="btn btn-primary" onclick="downloadPDF(${p.id})" style="margin-top: 10px;">
                                <i class="fas fa-download"></i> Download PDF
                            </button>
                        </div>
                    `;
                }).join('')}
            `;
        }
        
        function downloadPDF(id) {
            showToast('PDF downloaded successfully!', 'success');
        }
        
        function showNewPrescription() {
            const patientOptions = patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            
            showModal('New Prescription', `
                <div class="form-group">
                    <label>Patient</label>
                    <select id="rxPatient" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        ${patientOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Diagnosis</label>
                    <input type="text" id="rxDiagnosis" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="form-group">
                    <label>Medicines</label>
                    <textarea id="rxMedicines" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Instructions</label>
                    <textarea id="rxInstructions" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;" rows="3"></textarea>
                </div>
                <button class="btn btn-primary" onclick="savePrescription()" style="width: 100%;">Save Prescription</button>
            `);
        }
        
        function savePrescription() {
            const patientId = document.getElementById('rxPatient').value;
            const diagnosis = document.getElementById('rxDiagnosis').value.trim();
            const medicines = document.getElementById('rxMedicines').value.trim();
            const instructions = document.getElementById('rxInstructions').value.trim();
            
            if (!diagnosis || !medicines) {
                showToast('Please fill required fields!', 'error');
                return;
            }
            
            const newRx = {
                id: prescriptions.length + 1,
                patientId: parseInt(patientId),
                doctorId: currentUser.id,
                diagnosis: diagnosis,
                medicines: medicines,
                instructions: instructions,
                date: new Date().toISOString().split('T')[0]
            };
            
            prescriptions.push(newRx);
            closeModal();
            showToast('Prescription saved!', 'success');
        }
        
        function loadPatientPrescriptions() {
            const patient = patients[0];
            const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);
            
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">My Prescriptions</h2>
                ${patientPrescriptions.length === 0 ? 
                    '<p>No prescriptions found.</p>' : 
                    patientPrescriptions.map(p => {
                        const doctor = users.find(doc => doc.id === p.doctorId);
                        return `
                            <div class="prescription-card">
                                <div style="display: flex; justify-content: space-between;">
                                    <h4>Dr. ${doctor?.name || 'Unknown'}</h4>
                                    <span>${p.date}</span>
                                </div>
                                <p><strong>Diagnosis:</strong> ${p.diagnosis}</p>
                                <p><strong>Medicines:</strong> ${p.medicines}</p>
                                <p><strong>Instructions:</strong> ${p.instructions}</p>
                                <button class="btn btn-primary" onclick="getAIExplanation()">
                                    <i class="fas fa-robot"></i> AI Explanation
                                </button>
                            </div>
                        `;
                    }).join('')
                }
            `;
        }
        
        function getAIExplanation() {
            showModal('AI Prescription Explanation', `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <i class="fas fa-robot" style="font-size: 40px; margin-bottom: 10px;"></i>
                    <h3>Smart Prescription Assistant</h3>
                </div>
                
                <div style="background: #f0f9ff; padding: 20px; border-radius: 10px;">
                    <h4 style="color: #0b2f4e;">Simple Explanation</h4>
                    <p>This prescription contains medicines to treat your condition. Take exactly as prescribed by your doctor.</p>
                    
                    <h4 style="color: #0b2f4e; margin-top: 20px;">Lifestyle Advice</h4>
                    <ul style="margin-left: 20px;">
                        <li>Get plenty of rest</li>
                        <li>Stay hydrated - drink 8-10 glasses of water</li>
                        <li>Avoid stress and screen time</li>
                        <li>Follow up if symptoms persist</li>
                    </ul>
                    
                    <h4 style="color: #0b2f4e; margin-top: 20px;">Preventive Care</h4>
                    <p>Maintain a healthy diet, exercise regularly, and get annual checkups.</p>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #ffeaa7; border-radius: 8px; text-align: center;">
                        <h4 style="color: #d35400;">اردو میں وضاحت</h4>
                        <p>یہ نسخہ آپ کے علاج کے لیے ہے۔ براہ کرم ہدایات پر عمل کریں اور آرام کریں۔</p>
                    </div>
                </div>
            `);
        }
        
        function loadPatientHealth() {
            const patient = patients[0];
            
            const timeline = [
                ...appointments.filter(a => a.patientId === patient.id).map(a => ({
                    type: 'appointment',
                    date: a.date,
                    icon: 'fa-calendar-check',
                    color: '#3498db',
                    title: 'Appointment',
                    desc: `Dr. ${users.find(u => u.id === a.doctorId)?.name} - ${a.symptoms}`
                })),
                ...prescriptions.filter(p => p.patientId === patient.id).map(p => ({
                    type: 'prescription',
                    date: p.date,
                    icon: 'fa-prescription',
                    color: '#27ae60',
                    title: 'Prescription',
                    desc: p.diagnosis
                }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">My Health Timeline</h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Blood Group</h3>
                        <div class="stat-number">${patient.blood}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Age</h3>
                        <div class="stat-number">${patient.age}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Gender</h3>
                        <div class="stat-number">${patient.gender}</div>
                    </div>
                </div>
                
                <div class="table-container">
                    <h3 style="margin-bottom: 20px;">Medical History</h3>
                    ${timeline.length === 0 ? 
                        '<p>No medical history found.</p>' : 
                        timeline.map(t => `
                            <div style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #eee;">
                                <div style="width: 40px; height: 40px; background: ${t.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                                    <i class="fas ${t.icon}"></i>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 14px;">${t.date}</div>
                                    <div style="font-weight: 600;">${t.title}</div>
                                    <div>${t.desc}</div>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            `;
        }
        
        function loadAnalytics() {
            const content = document.getElementById('content');
            
            const totalApps = appointments.length;
            const completed = appointments.filter(a => a.status === 'completed').length;
            const pending = appointments.filter(a => a.status === 'pending').length;
            const confirmed = appointments.filter(a => a.status === 'confirmed').length;
            
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Analytics Dashboard</h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Appointments</h3>
                        <div class="stat-number">${totalApps}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Completed</h3>
                        <div class="stat-number">${completed}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Confirmed</h3>
                        <div class="stat-number">${confirmed}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Pending</h3>
                        <div class="stat-number">${pending}</div>
                    </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 15px;">
                    <h3 style="margin-bottom: 20px;">Weekly Trends</h3>
                    <div style="height: 300px; display: flex; align-items: flex-end; gap: 20px; justify-content: center;">
                        <div style="text-align: center;">
                            <div style="height: 100px; width: 50px; background: #667eea; border-radius: 8px;"></div>
                            <div style="margin-top: 10px;">Mon</div>
                            <div>5</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="height: 160px; width: 50px; background: #667eea; border-radius: 8px;"></div>
                            <div style="margin-top: 10px;">Tue</div>
                            <div>8</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="height: 240px; width: 50px; background: #667eea; border-radius: 8px;"></div>
                            <div style="margin-top: 10px;">Wed</div>
                            <div>12</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="height: 140px; width: 50px; background: #667eea; border-radius: 8px;"></div>
                            <div style="margin-top: 10px;">Thu</div>
                            <div>7</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="height: 180px; width: 50px; background: #667eea; border-radius: 8px;"></div>
                            <div style="margin-top: 10px;">Fri</div>
                            <div>9</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        function loadDoctors() {
            const doctors = users.filter(u => u.role === 'doctor');
            
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Doctors Management</h2>
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="showAddDoctor()">
                        <i class="fas fa-plus"></i> Add Doctor
                    </button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Patients</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${doctors.map(d => `
                                <tr>
                                    <td>${d.name}</td>
                                    <td>${d.email}</td>
                                    <td>${appointments.filter(a => a.doctorId === d.id).length}</td>
                                    <td><span class="status confirmed">Active</span></td>
                                    <td>
                                        <button class="btn btn-danger btn-sm" onclick="removeDoctor(${d.id})">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        function showAddDoctor() {
            showModal('Add New Doctor', `
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="docName" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="docEmail" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <div class="form-group">
                    <label>Specialization</label>
                    <input type="text" id="docSpec" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                </div>
                <button class="btn btn-primary" onclick="addDoctor()" style="width: 100%;">Add Doctor</button>
            `);
        }
        
        function addDoctor() {
            const name = document.getElementById('docName').value.trim();
            const email = document.getElementById('docEmail').value.trim();
            
            if (!name || !email) {
                showToast('Please fill all fields!', 'error');
                return;
            }
            
            const newDoctor = {
                id: users.length + 1,
                name: name,
                email: email,
                password: 'doctor123',
                role: 'doctor'
            };
            
            users.push(newDoctor);
            closeModal();
            showToast('Doctor added successfully!', 'success');
            loadDoctors();
        }
        
        function removeDoctor(id) {
            if (confirm('Are you sure you want to remove this doctor?')) {
                users = users.filter(u => u.id !== id);
                showToast('Doctor removed!', 'success');
                loadDoctors();
            }
        }
        
        function loadSubscriptions() {
            const content = document.getElementById('content');
            
            content.innerHTML = `
                <h2 style="margin-bottom: 20px;">Subscription Plans</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="background: white; padding: 30px; border-radius: 15px; text-align: center;">
                        <h3 style="color: #0b2f4e;">Free Plan</h3>
                        <div style="font-size: 36px; font-weight: 700; margin: 20px 0;">₹0</div>
                        <ul style="list-style: none; margin: 20px 0;">
                            <li style="padding: 10px;">✓ Up to 50 patients</li>
                            <li style="padding: 10px;">✓ Basic features</li>
                            <li style="padding: 10px;">✗ No AI access</li>
                            <li style="padding: 10px;">✗ No analytics</li>
                        </ul>
                        <button class="btn btn-primary">Current Plan</button>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
                        <h3>Pro Plan</h3>
                        <div style="font-size: 36px; font-weight: 700; margin: 20px 0;">₹999</div>
                        <ul style="list-style: none; margin: 20px 0;">
                            <li style="padding: 10px;">✓ Unlimited patients</li>
                            <li style="padding: 10px;">✓ All features</li>
                            <li style="padding: 10px;">✓ AI diagnosis</li>
                            <li style="padding: 10px;">✓ Advanced analytics</li>
                        </ul>
                        <button class="btn" style="background: white; color: #0b2f4e;">Upgrade</button>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 15px; text-align: center;">
                        <h3 style="color: #0b2f4e;">Enterprise</h3>
                        <div style="font-size: 36px; font-weight: 700; margin: 20px 0;">Custom</div>
                        <ul style="list-style: none; margin: 20px 0;">
                            <li style="padding: 10px;">✓ Everything in Pro</li>
                            <li style="padding: 10px;">✓ Custom features</li>
                            <li style="padding: 10px;">✓ Dedicated support</li>
                            <li style="padding: 10px;">✓ API access</li>
                        </ul>
                        <button class="btn btn-primary">Contact Sales</button>
                    </div>
                </div>
            `;
        }
        
        // ==================== UTILITIES ====================
        function showModal(title, body) {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalBody').innerHTML = body;
            document.getElementById('modal').classList.add('active');
        }
        
        function closeModal() {
            document.getElementById('modal').classList.remove('active');
        }
        
        function hideLoading() {
            document.getElementById('loading').classList.remove('active');
        }
        
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast ' + type;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        function updateStatus(id) {
            const appointment = appointments.find(a => a.id === id);
            if (appointment.status === 'pending') {
                appointment.status = 'confirmed';
            } else if (appointment.status === 'confirmed') {
                appointment.status = 'completed';
            }
            showToast('Status updated!', 'success');
            loadAppointments();
        }
        
        function cancelAppointment(id) {
            if (confirm('Cancel this appointment?')) {
                appointments = appointments.filter(a => a.id !== id);
                showToast('Appointment cancelled!', 'success');
                loadAppointments();
            }
        }
        
        function viewPatientHistory(id) {
            const patient = patients.find(p => p.id === id);
            const patientApps = appointments.filter(a => a.patientId === id);
            const patientPrescriptions = prescriptions.filter(p => p.patientId === id);
            
            showModal(`Patient History - ${patient.name}`, `
                <p><strong>Age:</strong> ${patient.age}</p>
                <p><strong>Gender:</strong> ${patient.gender}</p>
                <p><strong>Phone:</strong> ${patient.phone}</p>
                <p><strong>Blood Group:</strong> ${patient.blood}</p>
                
                <h4 style="margin: 20px 0 10px;">Appointments (${patientApps.length})</h4>
                ${patientApps.map(a => `
                    <div style="padding: 10px; background: #f5f5f5; margin-bottom: 5px; border-radius: 5px;">
                        ${a.date} at ${a.time} - ${a.symptoms} (${a.status})
                    </div>
                `).join('')}
                
                <h4 style="margin: 20px 0 10px;">Prescriptions (${patientPrescriptions.length})</h4>
                ${patientPrescriptions.map(p => `
                    <div style="padding: 10px; background: #f5f5f5; margin-bottom: 5px; border-radius: 5px;">
                        ${p.date} - ${p.diagnosis}
                    </div>
                `).join('')}
            `);
        }
        
        function showNewAppointment() {
            const doctors = users.filter(u => u.role === 'doctor');
            const patientsList = patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            
            showModal('New Appointment', `
                <div class="form-group">
                    <label>Patient</label>
                    <select id="newAppPatient" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        ${patientsList}
                    </select>
                </div>
                <div class="form-group">
                    <label>Doctor</label>
                    <select id="newAppDoctor" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;">
                        ${doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="newAppDate" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;" value="2026-03-10">
                    </div>
                    <div class="form-group">
                        <label>Time</label>
                        <input type="time" id="newAppTime" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;" value="10:00">
                    </div>
                </div>
                <div class="form-group">
                    <label>Symptoms</label>
                    <textarea id="newAppSymptoms" style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px;" rows="3"></textarea>
                </div>
                <button class="btn btn-primary" onclick="createAppointment()" style="width: 100%;">Create Appointment</button>
            `);
        }
        
        function createAppointment() {
            const patientId = document.getElementById('newAppPatient').value;
            const doctorId = document.getElementById('newAppDoctor').value;
            const date = document.getElementById('newAppDate').value;
            const time = document.getElementById('newAppTime').value;
            const symptoms = document.getElementById('newAppSymptoms').value.trim();
            
            if (!symptoms) {
                showToast('Please describe symptoms!', 'error');
                return;
            }
            
            const newApp = {
                id: appointments.length + 1,
                patientId: parseInt(patientId),
                doctorId: parseInt(doctorId),
                date: date,
                time: time,
                status: 'pending',
                symptoms: symptoms
            };
            
            appointments.push(newApp);
            closeModal();
            showToast('Appointment created!', 'success');
            loadAppointments();
        }
        
        // Check for saved session
        (function() {
            const saved = localStorage.getItem('user');
            if (saved) {
                try {
                    currentUser = JSON.parse(saved);
                    document.getElementById('loginPage').style.display = 'none';
                    document.getElementById('dashboard').classList.add('active');
                    document.getElementById('userNameDisplay').textContent = currentUser.name;
                    document.getElementById('userRole').textContent = currentUser.role;
                    loadMenu();
                    loadDashboard();
                } catch (e) {
                    console.error('Error loading saved session:', e);
                }
            }
        })();
    