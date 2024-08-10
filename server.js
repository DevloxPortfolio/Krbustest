require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const dbURI = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 3000; // Ensure port is dynamic or use an environment variable

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Student Schema and Model
const studentSchema = new mongoose.Schema({
  EnrollmentCode: String,
  StudentName: String,
  Gender: String,
  Class: String,
  Stop: String,
  Address: String,
  BusNumber: { type: String, default: null },
  BusSrNumber: { type: String, default: null },
  StopName: String // Add StopName field
});

const Student = mongoose.model('students', studentSchema);

// Bus Schema and Model
const busSchema = new mongoose.Schema({
  Busno: String,
  BusSrNO: String,
  stop1: String,
  stop2: String,
  stop3: String,
  stop4: String,
  stop5: String,
  stop6: String,
  stop7: String,
  stop8: String,
  stop9: String,
  Route: String,
  Seat: Number,
  Capacity: Number,
  Brand: String,
});

const Bus = mongoose.model('buses', busSchema);

// Stop Schema and Model
const stopSchema = new mongoose.Schema({
  code: String,
  stopname: String
});

const Stop = mongoose.model('stops', stopSchema);

app.use(cors());
app.use(express.json());

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Function to trim white spaces from object values
const trimObjectValues = (obj) => {
  const trimmedObj = {};
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'string') {
      trimmedObj[key] = obj[key].trim();
    } else {
      trimmedObj[key] = obj[key];
    }
  }
  return trimmedObj;
};

// Student Upload Route
app.post('/upload', upload.single('excelFile'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const duplicates = [];
    let duplicateCount = 0;

    for (const row of rows) {
      const trimmedRow = trimObjectValues(row);
      const existingStudent = await Student.findOne({ EnrollmentCode: trimmedRow.EnrollmentCode });
      if (existingStudent) {
        duplicates.push({ rowNumber: row.__rowNum__, enrollmentCode: trimmedRow.EnrollmentCode });
        duplicateCount++;
      } else {
        const newStudent = new Student(trimmedRow);
        await newStudent.save();
      }
    }

    res.status(200).json({ message: 'File processed successfully', duplicateCount });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
});

// Bus Upload Route
app.post('/upload-bus', upload.single('busFile'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    const duplicates = [];
    let duplicateCount = 0;

    for (const row of rows) {
      const trimmedRow = trimObjectValues(row);
      const existingBus = await Bus.findOne({ Busno: trimmedRow.Busno });
      if (existingBus) {
        duplicates.push({ rowNumber: row.__rowNum__, busno: trimmedRow.Busno });
        duplicateCount++;
      } else {
        const newBus = new Bus(trimmedRow);
        await newBus.save();
      }
    }

    res.status(200).json({ message: 'File processed successfully', duplicateCount });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API Routes here...

// Catch-all handler to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
