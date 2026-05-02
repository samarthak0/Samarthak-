const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(express.static('./')); // Frontend files serve karne ke liye

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("Connection Error:", err));

// Database Schemas
const ConfigSchema = new mongoose.Schema({ data: Object });
const StudentSchema = new mongoose.Schema({ 
    id: String, regNo: String, name: String, mobile: String, 
    email: String, shift: String, seat: Number, photo: String, 
    feeHistory: Array, date: String, dob: String, shiftName: String
});
const AttendanceSchema = new mongoose.Schema({ regNo: String, name: String, date: String, photo: String });

const Config = mongoose.model('Config', ConfigSchema);
const Student = mongoose.model('Student', StudentSchema);
const Attendance = mongoose.model('Attendance', AttendanceSchema);

// API Endpoints
app.get('/api/data', async (req, res) => {
    const config = await Config.findOne();
    const students = await Student.find();
    const attendances = await Attendance.find();
    res.json({ config: config?.data || {}, students, attendances });
});

app.post('/api/config', async (req, res) => {
    await Config.findOneAndUpdate({}, { data: req.body }, { upsert: true });
    res.json({ success: true });
});

app.post('/api/students', async (req, res) => {
    const { id } = req.body;
    await Student.findOneAndUpdate({ id }, req.body, { upsert: true });
    res.json({ success: true });
});

app.delete('/api/students/:id', async (req, res) => {
    await Student.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
});

app.post('/api/attendance', async (req, res) => {
    const newAtt = new Attendance(req.body);
    await newAtt.save();
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
