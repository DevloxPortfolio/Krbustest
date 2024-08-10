import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentBusTable.css'; // Import your CSS file for styling

const StudentBusTable = () => {
  const [studentsWithNoBus, setStudentsWithNoBus] = useState([]);
  const [nonAllocatedBuses, setNonAllocatedBuses] = useState([]);
  const [allocatedCount, setAllocatedCount] = useState(0);
  const [nonAllocatedCount, setNonAllocatedCount] = useState(0);
  const [nonAllocatedBusesCount, setNonAllocatedBusesCount] = useState(0);

  useEffect(() => {
    const fetchStudentsWithBuses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/students-with-buses');
        setStudentsWithNoBus(response.data.studentsWithNoBus);
        setNonAllocatedBuses(response.data.nonAllocatedBuses);
        setAllocatedCount(response.data.allocatedCount);
        setNonAllocatedCount(response.data.nonAllocatedCount);
        setNonAllocatedBusesCount(response.data.nonAllocatedBusesCount);
      } catch (error) {
        console.error('Error fetching students with buses:', error);
      }
    };

    fetchStudentsWithBuses();
  }, []);

  return (
    <div className="student-bus-table-container">
      <h2>Student and Bus Allocation</h2>
      <p>Allocated Students: {allocatedCount}</p>
      <p>Non-Allocated Students: {nonAllocatedCount}</p>
      <p>Non-Allocated Buses: {nonAllocatedBusesCount}</p>
      
      <h3>Students with No Bus Allocated</h3>
      <table className="student-bus-table">
        <thead>
          <tr>
            <th>Enrollment Code</th>
            <th>Student Name</th>
            <th>Gender</th>
            <th>Class</th>
            <th>Stop</th>
            <th>Address</th>
            <th>Bus Number</th>
            <th>Bus SR Number</th>
          </tr>
        </thead>
        <tbody>
          {studentsWithNoBus.map((student) => (
            <tr key={student._id}>
              <td>{student.EnrollmentCode}</td>
              <td>{student.StudentName}</td>
              <td>{student.Gender}</td>
              <td>{student.Class}</td>
              <td>{student.Stop}</td>
              <td>{student.Address}</td>
              <td>Not Allocated</td>
              <td>Not Allocated</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Buses with No Students Allocated</h3>
      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Bus SR Number</th>
            <th>Route</th>
            <th>Capacity</th>
            <th>Brand</th>
            <th>Stops</th>
          </tr>
        </thead>
        <tbody>
          {nonAllocatedBuses.map((bus) => (
            <tr key={bus.Busno}>
              <td>{bus.Busno}</td>
              <td>{bus.BusSrNO}</td>
              <td>{bus.Route}</td>
              <td>{bus.Capacity}</td>
              <td>{bus.Brand}</td>
              <td>
                {[...Array(9).keys()].map(i => bus[`stop${i + 1}`] && (
                  <div key={i}>{bus[`stop${i + 1}`]}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentBusTable;
