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
const port = 3000; 

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

// Fetch Students with Bus Allocation Route
app.get('/students-with-buses', async (req, res) => {
  try {
    const students = await Student.find({});
    const buses = await Bus.find({});
    const stops = await Stop.find({});

    const stopMap = stops.reduce((map, stop) => {
      map[stop.code] = stop.stopname;
      return map;
    }, {});

    const allocatedBuses = new Set();
    let allocatedCount = 0;
    let nonAllocatedCount = 0;
    let nonAllocatedStudents = [];
    
    // Clone buses to track capacity changes
    const busesClone = buses.map(bus => ({ ...bus.toObject() }));

    for (const student of students) {
      let assigned = false;
      for (const bus of busesClone) {
        for (let i = 1; i <= 9; i++) {
          if (student.Stop === bus[`stop${i}`] && bus.Capacity > 0) {
            student.BusNumber = bus.Busno;
            student.BusSrNumber = bus.BusSrNO;
            student.StopName = stopMap[student.Stop]; 
            bus.Capacity--;
            allocatedBuses.add(bus.Busno);
            assigned = true;
            break;
          }
        }
        if (assigned) break;
      }
      if (assigned) {
        allocatedCount++;
      } else {
        nonAllocatedStudents.push(student);
      }
    }

    // Update the database with the allocated bus information
    await Promise.all(students.map(student => Student.updateOne({ _id: student._id }, student)));
    nonAllocatedCount = buses.length - allocatedBuses.size;

    // Compute capacity details
    const capacityDetails = buses.map(bus => ({
      BusNumber: bus.Busno,
      Route: bus.Route,
      InitialCapacity: bus.Capacity + (buses.find(b => b.Busno === bus.Busno).Capacity - bus.Capacity),
      FinalCapacity: bus.Capacity
    }));

    // Log allocated students with bus details and stops
    console.log('Allocated Students with Bus Details:');
    students.forEach(student => {
      if (student.BusNumber) {
        console.log(`Enrollment Code: ${student.EnrollmentCode}, Student Name: ${student.StudentName}, Bus Number: ${student.BusNumber}, Bus SR Number: ${student.BusSrNumber}, Stop: ${student.StopName}`);
      }
    });

    res.status(200).json({ students, nonAllocatedStudents, allocatedCount, nonAllocatedCount, capacityDetails });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Error fetching student data', error });
  }
});

// Search Students by Bus Number
app.get('/api/students/search-by-bus', async (req, res) => {
  try {
    const { busNumber } = req.query;
    const students = await Student.find({ BusNumber: busNumber });
    res.status(200).json(students);
  } catch (err) {
    console.error('Error searching students by bus:', err);
    res.status(500).json({ message: err.message });
  }
});

// Search Buses by Student Name
app.get('/api/buses/search-by-student', async (req, res) => {
  try {
    const { studentName } = req.query;
    const students = await Student.find({ StudentName: new RegExp(studentName, 'i') });
    const busNumbers = students.map(student => student.BusNumber);
    const buses = await Bus.find({ Busno: { $in: busNumbers } });
    res.status(200).json(buses);
  } catch (err) {
    console.error('Error searching buses by student:', err);
    res.status(500).json({ message: err.message });
  }
});

// Fetch All Students Route
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Error fetching student data', error });
  }
});

// Fetch All Buses Route
app.get('/buses', async (req, res) => {
  try {
    const buses = await Bus.find({});
    res.status(200).json(buses);
  } catch (error) {
    console.error('Error fetching bus data:', error);
    res.status(500).json({ message: 'Error fetching bus data', error });
  }
});

// Search Buses by Route Route
app.get('/api/buses/search', async (req, res) => {
  try {
    const { route } = req.query;
    const buses = await Bus.find({ Route: { $regex: route, $options: 'i' } });
    res.json(buses);
  } catch (err) {
    console.error('Error searching buses:', err);
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at https://krbustest.vercel.app/${port}/`);
});
