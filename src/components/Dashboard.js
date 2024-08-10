// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import './dashboard.css'

const Dashboard = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/students');
      const data = response.data;
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Prepare data for chart
  const classLabels = [...new Set(studentData.map(student => student.class))];
  const classCounts = classLabels.map(label => {
    return studentData.filter(student => student.class === label).length;
  });

  const data = {
    labels: classLabels,
    datasets: [
      {
        label: 'Total Students',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: classCounts,
      },
    ],
  };

  return (
    <div> 
      <header>
        <div> 
          <h2>Dashboard</h2> 
          <h6>By Krbus</h6>
        </div>
      </header>
      <h2>Student Entries Dashboard</h2>
      <div style={{ height: '400px', width: '500px', boxShadow: '0px 0px 15px black', marginLeft:'65%', borderRadius: '24px', padding: '10px'}} className="bargraph">
        <Bar
          data={data}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
