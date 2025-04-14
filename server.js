require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process'); // Use child_process module
const session = require('express-session');
const bcrypt = require('bcrypt'); // For hashing passwords

const app = express();
const PORT = process.env.PORT || 5000;

const ADMIN_CREDENTIALS = {
    username: 'admin', // Replace with your desired admin username
    password: 'adminpass' // Replace with your desired admin password
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(session({
    secret: 'your-secret-key', // Replace with a secure key
    resave: false,
    saveUninitialized: true
}));

// Middleware to check admin authentication
function isAdmin(req, res, next) {
    if (req.session.isAuthenticated && req.session.role === 'admin') {
        return next();
    } else {
        return res.status(403).send('Access denied');
    }
}

// Example admin route
app.get('/admin-data', isAdmin, (req, res) => {
    // Fetch and send data that only the admin can view
    res.json({ message: 'This is admin-only data' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Define schemas and models
const studentSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    name: String,
    roll_no: String,
    program: String,
    batch: String,
    department: String,
    Official_email: String,
    personal_email: String,
    students_phone: String,
    emg_phone1: String,
    emg_phone2: String,
    blood: String
});
const Student = mongoose.model('Student', studentSchema);

const mentorSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    mentor_name: String,
    emp_code: String,
    designation: String,
    department: String,
    mentor_phone: String
});
const Mentor = mongoose.model('Mentor', mentorSchema);

const studentInfoSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    studentname: String,
    roll_no: String,
    pob: String,
    birthday: Date,
    gender: String,
    entry: String,
    personalemail: String,
    contact_no: String,
    whatsapp_number: String,
    religion: String,
    caste: String,
    quota: String,
    address: String,
    permanent_address: String
});
const StudentInfo = mongoose.model('StudentInfo', studentInfoSchema);

const parentsSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    father_name: String,
    father_qualification: String,
    father_occupation: String,
    father_designation: String,
    father_income: String,
    father_mobile: String,
    father_email: String,
    mother_name: String,
    mother_qualification: String,
    mother_occupation: String,
    mother_designation: String,
    mother_income: String,
    mother_mobile: String,
    mother_email: String
});
const Parents = mongoose.model('Parents', parentsSchema);

const siblingsSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    sibling1_name: String,
    sibling1_education: String,
    sibling2_name: String,
    sibling2_education: String,
    sibling3_name: String,
    sibling3_education: String,
    guardian_name: String,
    guardian_relationship: String,
    guardian_qualification: String,
    guardian_occupation: String,
    guardian_designation: String,
    guardian_mobile: String,
    guardian_email: String
});
const Siblings = mongoose.model('Siblings', siblingsSchema);

const pgSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    subjects: [
      {
        name: String,
        marks: Number,
        year: Number,
        ranking: String,
      },
    ],
    co_curricular: String,
    hobbies: String,
    extra_activities: String,
    hostel_details: [
      {
        year: String,
        accommodation: String,
        remarks: String,
      },
    ],
});
const Pg = mongoose.model('Pg', pgSchema);

const counsellingSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    subjects: [{
        name: String,
        marks: Number,
        year: Number,
        ranking: String
    }],
    co_curricular: String,
    hobbies: String,
    extra_activities: String,
    hostel_details: [{
        year: String,
        hostel: String,
        remarks: String
    }]
});
const Counselling = mongoose.model('Counselling', counsellingSchema);

const academicSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    studentId: mongoose.Schema.Types.ObjectId, // Reference to the student
    semesters: [{
        semester: String,
        subjects: [{
            name: String,
            internal1: Number,
            internal2: Number,
            internal3: Number,
            model_practical: Number,
            internal_marks: Number,
            external_marks: Number,
            grade: String,
            year_of_passing: Number
        }],
        gpa: Number,
        cgpa: Number,
        attendance: Number,
        remarks: String
    }]
});
const Academic = mongoose.model('Academic', academicSchema);

const academic1Schema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    studentId: mongoose.Schema.Types.ObjectId, // Reference to the student
    semesters: [{
        semester: String,
        subjects: [{
            name: String,
            internal1: Number,
            internal2: Number,
            internal3: Number,
            model_practical: Number,
            internal_marks: Number,
            external_marks: Number,
            grade: String,
            year: Number
        }],
        gpa: Number,
        cgpa: Number,
        attendance: Number,
        remarks: String
    }]
});
const Academic1 = mongoose.model('Academic1', academic1Schema);

const academic2Schema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    studentId: mongoose.Schema.Types.ObjectId, // Reference to the student
    semesters: [{
        semester: String,
        subjects: [{
            name: String,
            internal1: Number,
            internal2: Number,
            internal3: Number,
            model_practical: Number,
            internal_marks: Number,
            external_marks: Number,
            grade: String,
            year: Number
        }],
        gpa: Number,
        cgpa: Number,
        attendance: Number,
        remarks: String
    }]
});
const Academic2 = mongoose.model('Academic2', academic2Schema);

const academic3Schema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    studentId: mongoose.Schema.Types.ObjectId, // Reference to the student
    semesters: [{
        semester: String,
        subjects: [{
            name: String,
            internal1: Number,
            internal2: Number,
            internal3: Number,
            model_practical: Number,
            internal_marks: Number,
            external_marks: Number,
            grade: String,
            year: Number
        }],
        gpa: Number,
        cgpa: Number,
        attendance: Number,
        remarks: String
    }]
});
const Academic3 = mongoose.model('Academic3', academic3Schema);

const finalReportSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Associate with the logged-in user
    achievements: String,
    project_details: String,
    overseas_travel: String,
    placement_details: String,
    last_date_college: Date,
    convocation_date: Date,
    overall_cgpa: Number,
    scholarship_details: String,
    student_opinion: String,
    mentor_details: String,
    mentor_cgpa: Number,
    mentor_placement_details: String,
    higher_education: String,
    entrepreneurship: String,
    address_communication: String,
    alumni_details: {
        instagram: String,
        linkedin: String,
        facebook: String,
        whatsapp_number: String,
        email_id: String,
        phone_number: String,
        landline_number: String
    },
    student_feedback: String,
    mentor_feedback: String
});
const FinalReport = mongoose.model('FinalReport', finalReportSchema);

const userAccountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords for security
    createdAt: { type: Date, default: Date.now }
});

const UserAccount = mongoose.model('UserAccount', userAccountSchema);

// Dummy user credentials (replace with a database in production)
const users = [
    { username: 'sharan', password: 'password123' },
    { username: 'user1', password: 'userpass' }
];

// Admin credentials (replace with a database in production)
const admins = [
    { username: 'admin', password: 'adminpass' }
];

// Login route
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        if (role === 'admin') {
            // Check if the credentials match the hardcoded admin credentials
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                req.session.isAuthenticated = true;
                req.session.username = username;
                req.session.role = 'admin';
                return res.status(200).json({ success: true, redirectUrl: '/admin-dashboard.html' });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
            }
        } else if (role === 'user') {
            // Handle user login (validate against database)
            const user = await UserAccount.findOne({ username });
            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            const bcrypt = require('bcrypt');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            req.session.isAuthenticated = true;
            req.session.username = username;
            req.session.role = 'user';
            return res.status(200).json({ success: true, redirectUrl: '/student.html' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid role selected' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});

// User registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await UserAccount.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user account
        const newUser = new UserAccount({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Routes for form submissions and data retrieval
// Redirect to mentor.html after saving student data
app.post('/submit-student', (req, res) => {
    try {
        req.session.studentData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Student Data Stored in Session:', req.session.studentData);
        res.redirect('/mentor.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error storing student data:', error);
        res.status(500).send('Error storing student data: ' + error.message);
    }
});
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find({ username: req.session.username });
        res.json(students); // View student data
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Redirect to studentinfo.html after saving mentor data
app.post('/submit-mentor', (req, res) => {
    try {
        req.session.mentorData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Mentor Data:', req.session.mentorData); // Log the data for debugging
        res.redirect('/studentinfo.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving mentor data:', error);
        res.status(500).send('Error saving mentor data: ' + error.message);
    }
});
app.get('/mentors', async (req, res) => {
    try {
        const mentors = await Mentor.find({ username: req.session.username });
        res.json(mentors); // View mentor data
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Redirect to parents.html after saving student info data
app.post('/submit-studentinfo', (req, res) => {
    try {
        req.session.studentInfoData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Student Info Data:', req.session.studentInfoData); // Log the data for debugging
        res.redirect('/parents.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving student info data:', error);
        res.status(500).send('Error saving student info data: ' + error.message);
    }
});
app.get('/students-info', async (req, res) => {
    try {
        const studentsInfo = await StudentInfo.find({ username: req.session.username });
        res.json(studentsInfo); // View student info data
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Redirect to siblings.html after saving parents data
app.post('/submit-parents', (req, res) => {
    try {
        req.session.parentsData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Parents Data:', req.session.parentsData); // Log the data for debugging
        res.redirect('/siblings.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving parents data:', error);
        res.status(500).send('Error saving parents data: ' + error.message);
    }
});
app.get('/parents', async (req, res) => {
    try {
        const parents = await Parents.find({ username: req.session.username });
        res.status(200).json(parents); // View parents data
    } catch (error) {
        res.status(500).send(error);
    }
});

// Redirect to pg.html after saving siblings data
app.post('/submit-siblings', (req, res) => {
    try {
        req.session.siblingsData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Siblings Data:', req.session.siblingsData); // Log the data for debugging
        res.redirect('/pg.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving siblings data:', error);
        res.status(500).send('Error saving siblings data: ' + error.message);
    }
});
app.get('/siblings', async (req, res) => {
    try {
        const siblings = await Siblings.find({ username: req.session.username });
        res.status(200).json(siblings); // View siblings data
    } catch (error) {
        res.status(500).send(error);
    }
});

// Redirect to conselling.html after saving PG data
app.post('/submit-pg', (req, res) => {
    try {
        req.session.pgData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('PG Data:', req.session.pgData); // Log the data for debugging
        res.redirect('/conselling.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving PG data:', error);
        res.status(500).send('Error saving PG data: ' + error.message);
    }
});
app.get('/pg', async (req, res) => {
    try {
        const pg = await Pg.find({ username: req.session.username });
        res.status(200).json(pg); // View PG data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

// Redirect to academic.html after saving counselling data
app.post('/submit-counselling', (req, res) => {
    try {
        req.session.counsellingData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Counselling Data:', req.session.counsellingData); // Log the data for debugging
        res.redirect('/academic.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving counselling data:', error);
        res.status(500).send('Error saving counselling data: ' + error.message);
    }
});
app.get('/counselling', async (req, res) => {
    try {
        const counselling = await Counselling.find({ username: req.session.username });
        res.status(200).json(counselling); // View counselling data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

// Redirect to academic1.html after saving academic data
app.post('/submit-academic', (req, res) => {
    try {
        req.session.academicData = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Academic Data:', req.session.academicData); // Log the data for debugging
        res.redirect('/academic1.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving academic data:', error);
        res.status(500).send('Error saving academic data: ' + error.message);
    }
});
app.get('/academic-records', async (req, res) => {
    try {
        const records = await Academic.find({ username: req.session.username });
        res.status(200).json(records); // View academic data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

// Redirect to academic2.html after saving academic1 data
app.post('/submit-academic1', (req, res) => {
    try {
        req.session.academic1Data = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Academic1 Data:', req.session.academic1Data); // Log the data for debugging
        res.redirect('/academic2.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving academic1 data:', error);
        res.status(500).send('Error saving academic1 data: ' + error.message);
    }
});
app.get('/academic1-records', async (req, res) => {
    try {
        const records = await Academic1.find({ username: req.session.username });
        res.status(200).json(records); // View academic1 data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

// Redirect to academic3.html after saving academic2 data
app.post('/submit-academic2', (req, res) => {
    try {
        req.session.academic2Data = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Academic2 Data:', req.session.academic2Data); // Log the data for debugging
        res.redirect('/academic3.html'); // Redirect to the next page
    } catch (error) {
        console.error('Error saving academic2 data:', error);
        res.status(500).send('Error saving academic2 data: ' + error.message);
    }
});
app.get('/academic2-records', async (req, res) => {
    try {
        const records = await Academic2.find({ username: req.session.username });
        res.status(200).json(records); // View academic2 data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

// Redirect to finalreport.html after saving academic3 data
app.post('/submit-academic3', (req, res) => {
    try {
        req.session.academic3Data = { ...req.body, username: req.session.username }; // Add username to the data
        console.log('Academic3 Data:', req.session.academic3Data); // Log the data for debugging
        res.redirect('/finalreport.html'); // Ensure this path is correct
    } catch (error) {
        console.error('Error saving academic3 data:', error);
        res.status(500).send('Error saving academic3 data: ' + error.message);
    }
});
app.get('/academic3-records', async (req, res) => {
    try {
        const records = await Academic3.find({ username: req.session.username });
        res.status(200).json(records); // View academic3 data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

// Save all data to MongoDB on final submission
app.post('/submit-finalreport', async (req, res) => {
    try {
        // Retrieve all data from the session
        const username = req.session.username; // Get the username from the session
        const studentData = req.session.studentData || {};
        const mentorData = req.session.mentorData || {};
        const studentInfoData = req.session.studentInfoData || {};
        const parentsData = req.session.parentsData || {};
        const siblingsData = req.session.siblingsData || {};
        const pgData = req.session.pgData || {};
        const counsellingData = req.session.counsellingData || {};
        const academicData = req.session.academicData || {};
        const academic1Data = req.session.academic1Data || {};
        const academic2Data = req.session.academic2Data || {};
        const academic3Data = req.session.academic3Data || {};
        const finalReportData = { ...req.body, username }; // Add the username to the final report data

        // Save each dataset to its corresponding MongoDB collection
        if (Object.keys(studentData).length > 0) {
            const newStudent = new Student(studentData);
            await newStudent.save();
            console.log('Student Data Saved:', newStudent);
        }

        if (Object.keys(mentorData).length > 0) {
            const newMentor = new Mentor(mentorData);
            await newMentor.save();
            console.log('Mentor Data Saved:', newMentor);
        }

        if (Object.keys(studentInfoData).length > 0) {
            const newStudentInfo = new StudentInfo(studentInfoData);
            await newStudentInfo.save();
            console.log('Student Info Data Saved:', newStudentInfo);
        }

        if (Object.keys(parentsData).length > 0) {
            const newParents = new Parents(parentsData);
            await newParents.save();
            console.log('Parents Data Saved:', newParents);
        }

        if (Object.keys(siblingsData).length > 0) {
            const newSiblings = new Siblings(siblingsData);
            await newSiblings.save();
            console.log('Siblings Data Saved:', newSiblings);
        }

        if (Object.keys(pgData).length > 0) {
            const newPg = new Pg(pgData);
            await newPg.save();
            console.log('PG Data Saved:', newPg);
        }

        if (Object.keys(counsellingData).length > 0) {
            const newCounselling = new Counselling(counsellingData);
            await newCounselling.save();
            console.log('Counselling Data Saved:', newCounselling);
        }

        if (Object.keys(academicData).length > 0) {
            const newAcademic = new Academic(academicData);
            await newAcademic.save();
            console.log('Academic Data Saved:', newAcademic);
        }

        if (Object.keys(academic1Data).length > 0) {
            const newAcademic1 = new Academic1(academic1Data);
            await newAcademic1.save();
            console.log('Academic1 Data Saved:', newAcademic1);
        }

        if (Object.keys(academic2Data).length > 0) {
            const newAcademic2 = new Academic2(academic2Data);
            await newAcademic2.save();
            console.log('Academic2 Data Saved:', newAcademic2);
        }

        if (Object.keys(academic3Data).length > 0) {
            const newAcademic3 = new Academic3(academic3Data);
            await newAcademic3.save();
            console.log('Academic3 Data Saved:', newAcademic3);
        }

        // Save the final report data
        const newFinalReport = new FinalReport(finalReportData);
        await newFinalReport.save();
        console.log('Final Report Data Saved:', newFinalReport);

        // Clear the session after saving
        req.session.destroy();

        // Redirect to the end page
        res.redirect('/end.html');
    } catch (error) {
        console.error('Error saving final report:', error);
        res.status(500).send('Error saving final report: ' + error.message);
    }
});
app.get('/finalreport-records', async (req, res) => {
    try {
        const reports = await FinalReport.find({ username: req.session.username });
        res.status(200).json(reports); // View final report data
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch final report data.' });
    }
});

app.get('/retrieve-data', async (req, res) => {
    try {
        const username = req.session.username; // Get the username from the session

        if (!username) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        // Fetch data from all collections associated with the username
        const studentData = await Student.findOne({ username });
        const mentorData = await Mentor.findOne({ username });
        const studentInfoData = await StudentInfo.findOne({ username });
        const parentsData = await Parents.findOne({ username });
        const siblingsData = await Siblings.findOne({ username });
        const pgData = await Pg.findOne({ username });
        const counsellingData = await Counselling.findOne({ username });
        const academic1Data = await Academic.findOne({ username });
        const academic2Data = await Academic.findOne({ username });
        const academic3Data = await Academic.findOne({ username });
        const finalReportData = await FinalReport.findOne({ username });

        // Combine all data into a single object
        const userData = {
            studentData,
            mentorData,
            studentInfoData,
            parentsData,
            siblingsData,
            pgData,
            counsellingData,
            academicData,
            academic1Data,
            academic2Data,
            academic3Data,
            finalReportData,
        };

        res.status(200).json(userData); // Send the data as JSON
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ message: 'Failed to retrieve data.' });
    }
});

// Route to retrieve all student data by username
app.get('/retrieve-student-data', async (req, res) => {
    const { username } = req.query; // Get the username from the query parameters

    try {
        // Fetch data from all collections associated with the username
        const studentData = await Student.findOne({ username }).lean();
        const mentorData = await Mentor.findOne({ username }).lean();
        const studentInfoData = await StudentInfo.findOne({ username }).lean();
        const parentsData = await Parents.findOne({ username }).lean();
        const siblingsData = await Siblings.findOne({ username }).lean();
        const pgData = await Pg.findOne({ username }).lean();
        const counsellingData = await Counselling.findOne({ username }).lean();
        const academicData = await Academic.findOne({ username }).lean();
        const academic1Data = await Academic1.findOne({ username }).lean();
        const academic2Data = await Academic2.findOne({ username }).lean();
        const academic3Data = await Academic3.findOne({ username }).lean();
        const finalReportData = await FinalReport.findOne({ username }).lean();

        // Combine all data into a single object
        const userData = {
            ...studentData,
            ...mentorData,
            ...studentInfoData,
            ...parentsData,
            ...siblingsData,
            ...pgData,
            ...counsellingData,
            ...academicData,
            ...academic1Data,
            ...academic2Data,
            ...academic3Data,
            ...finalReportData,
        };

        // Remove MongoDB-specific fields (_id, __v) from the response
        const cleanedData = {};
        for (const [key, value] of Object.entries(userData)) {
            if (key !== '_id' && key !== '__v') {
                cleanedData[key] = value;
            }
        }

        if (Object.keys(cleanedData).length === 0) {
            return res.status(404).json({ message: 'No data found for the given username' });
        }

        res.status(200).json(cleanedData); // Send the cleaned data as JSON
    } catch (error) {
        console.error('Error retrieving student data:', error);
        res.status(500).json({ message: 'Error retrieving student data' });
    }
});

// Endpoint to retrieve existing data for a user
app.get('/get-user-data', async (req, res) => {
    const { username } = req.query; // Get the username from the query parameters

    try {
        // Fetch the user data from the database
        const userData = await User.findOne({ username }).lean(); // Replace `User` with your actual model name

        if (!userData) {
            return res.status(404).json({ message: 'No data found for the given username' });
        }

        res.status(200).json(userData); // Send the user data as JSON
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

// Endpoint to update user data
app.post('/update-user-data', async (req, res) => {
    const { username, ...updatedData } = req.body;

    try {
        const result = await User.updateOne({ username }, { $set: updatedData }, { upsert: true });
        res.status(200).json({ message: 'Data updated successfully', result });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Error updating user data' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html'); // Redirect to login page after logout
    });
});

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/academic', (req, res) => res.sendFile(path.join(__dirname, 'public', 'academic.html')));
app.get('/academic1', (req, res) => res.sendFile(path.join(__dirname, 'public', 'academic1.html')));
app.get('/academic2', (req, res) => res.sendFile(path.join(__dirname, 'public', 'academic2.html')));
app.get('/academic3', (req, res) => res.sendFile(path.join(__dirname, 'public', 'academic3.html')));
app.get('/conselling', (req, res) => res.sendFile(path.join(__dirname, 'public', 'conselling.html')));
app.get('/end', (req, res) => res.sendFile(path.join(__dirname, 'public', 'end.html')));
app.get('/finalreport', (req, res) => res.sendFile(path.join(__dirname, 'public', 'finalreport.html')));
app.get('/mentor', (req, res) => res.sendFile(path.join(__dirname, 'public', 'mentor.html')));
app.get('/parents', (req, res) => res.sendFile(path.join(__dirname, 'public', 'parents.html')));
app.get('/pg', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pg.html')));
app.get('/siblings', (req, res) => res.sendFile(path.join(__dirname, 'public', 'siblings.html')));
app.get('/student', (req, res) => res.sendFile(path.join(__dirname, 'public', 'student.html')));
app.get('/studentinfo', (req, res) => res.sendFile(path.join(__dirname, 'public', 'studentinfo.html')));

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    exec(`start http://localhost:${PORT}`);
});

// Handle port conflicts
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying a different port...`);
        const newPort = PORT + 1; // Increment the port number
        app.listen(newPort, () => {
            console.log(`🚀 Server running on http://localhost:${newPort}`);
            exec(`start http://localhost:${newPort}`);
        });
    } else {
        console.error('Server error:', err);
    }
});

process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
