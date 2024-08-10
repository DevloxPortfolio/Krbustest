import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './upload.css';

const Graph = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://krpbus.vercel.app/students');
      const data = response.data;
      setStudentData(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  // Prepare data for chart
  const labels = studentData.map(student => student._id); // _id is the class name
  const counts = studentData.map(student => student.count); // count is the number of students in that class

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Students',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: counts,
      },
    ],
  };

  return (
    <div>
      <h2>Student Entries Dashboard</h2>
      <div className="graph-container">
        <Bar
          data={data}
          options={{
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </div>
  );
};

export default Graph;
