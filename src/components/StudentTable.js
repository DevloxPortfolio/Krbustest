import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentTable.css';

const StudentTable = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://krpbus.vercel.app/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  return (
    <div className="student-table-container">
      <h2>Student Details</h2>
      <table className="student-table">
        <thead>
          <tr> 
  
            <th>Enrollment Code</th>
            <th>Student Name</th>
            <th>Gender</th>
            <th>Class</th>
            <th>Stop</th>
            <th>Address</th>
         
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}> 
              <td>{student.EnrollmentCode}</td>
              <td>{student.StudentName}</td>
              <td>{student.Gender}</td>
              <td>{student.Class}</td>
              <td>{student.Stop}</td>
              <td>{student.Address}</td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
