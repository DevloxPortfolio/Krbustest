import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllocatedDetails.css';  
import LOGO from './logo.png';
import translations from './translations'; // Import translations

const AllocatedDetails = () => {
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBusNumber, setSearchBusNumber] = useState('');
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en'); // Default language

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, busesRes] = await Promise.all([
          axios.get('https://krpbus.vercel.app/students-with-buses'),
          axios.get('https://krpbus.vercel.app/buses')
        ]);
        setStudents(studentsRes.data.students || []);
        setBuses(busesRes.data.buses || []);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    try {
      // If search inputs are empty, show all students and buses
      if (!searchQuery && !searchBusNumber) {
        setFilteredStudents(students);
        setFilteredBuses(buses);
        return;
      }
  
      // Filter students based on searchQuery
      const filteredStudents = students.filter(student =>
        student.StudentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.EnrollmentCode.includes(searchQuery)
      );
      
      // Filter buses based on searchBusNumber
      const filteredBuses = buses.filter(bus =>
        bus.Busno.includes(searchBusNumber)
      );
  
      // Update state with filtered results
      setFilteredStudents(filteredStudents);
      setFilteredBuses(filteredBuses);
  
    } catch (err) {
      setError('Failed to filter data');
      console.error(err);
    }
  };
  
  

  const handlePrint = (content, lang) => {
    const printContent = `
      <html>
      <head>
        <title>Print</title> 
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 1.5em;
          }
          .header h2 {
            margin: 5px 0;
            font-size: 1.2em;
            color: #555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 0.8em;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          }
          th, td {
            padding: 12px 15px;
            border: 1px solid #ddd;
            text-align: start;
          }
          th {
            background-color: #f4f4f4;
          }
          tbody tr:nth-of-type(even) {
            background-color: #f9f9f9;
          }
          tbody tr:last-of-type {
            border-bottom: 2px solid #009879;
          }
          .print-container {
            padding: 20px;
            margin: auto;
            width: 90%;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
            opacity: 0.1;
            font-size: 3em;
            color: #ccc;
            pointer-events: none;
          }
          .watermark img {
            width: 400px; /* Adjust the size of the logo */
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h1>${translations[lang].schoolName}</h1>
            <h6>${translations[lang].devlox}</h6>
            <h2>${translations[lang].allocationDetails}</h2>
          </div>
          <div class="watermark">
            <img src="${LOGO}" alt="Logo"/> 
          </div>
          ${content}
        </div>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const getRowHTML = (row, type) => {
    if (type === 'student') {
      return `
        <h3>${translations[language].studentDetail}</h3>
        <table>
          <thead>
            <tr>
              <th>${translations[language].enrollmentCode}</th>
              <th>${translations[language].studentName}</th>
              <th>${translations[language].busNumber}</th>
              <th>${translations[language].busSrNo}</th>
              <th>${translations[language].stopName}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${row.EnrollmentCode}</td>
              <td>${row.StudentName}</td>
              <td>${row.BusNumber}</td>
              <td>${row.BusSrNo}</td>
              <td>${row.StopName}</td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (type === 'bus') {
      return `
        <h3>${translations[language].busDetail}</h3>
        <table>
          <thead>
            <tr>
              <th>${translations[language].busSrNumber}</th>
              <th>${translations[language].busNumber}</th>
              <th>${translations[language].route}</th>
              <th>${translations[language].capacity}</th>
              <th>${translations[language].brand}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${row.BusSrNo}</td>
              <td>${row.Busno}</td>
              <td>${row.Route}</td>
              <td>${row.Capacity}</td>
              <td>${row.Brand}</td>
            </tr>
          </tbody>
        </table>
      `;
    }
    return '';
  };

  const handleShowAll = () => {
    setFilteredStudents(students);
    setFilteredBuses(buses);
  };

  const toggleLanguage = () => {
    setLanguage(prevLanguage => prevLanguage === 'en' ? 'mr' : 'en');
  };

  return (
    <div>
      <header>
        <h3>{translations[language].allocationDetails} <br />
          <h6>by krbus</h6>
        </h3>
        <button onClick={toggleLanguage} className='switchlan'>
          {language === 'en' ? 'मराठी' : 'English'}
        </button>
      </header>
      <div className="container">
        <div className="main-content">
          <div className="search-section">
            <input
              type="text"
              placeholder={translations[language].searchBy}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="sbsn" required
            />
            <input
              type="text"
              placeholder={translations[language].searchBus}
              value={searchBusNumber}
              onChange={e => setSearchBusNumber(e.target.value)}
              className="sbsn" required
            />
           <button className="search-button" onClick={handleSearch}>
  {translations[language].search}
</button>
<button className="show-all-button" onClick={handleShowAll}>
  {translations[language].showAll}
</button>

          </div>

          {error && <div className="error-message">{error}</div>}

          <h3>{translations[language].filteredStudents}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>{translations[language].enrollmentCode}</th>
                <th>{translations[language].studentName}</th>
                <th>{translations[language].busNumber}</th>
                <th>{translations[language].stopName}</th>
                <th>{translations[language].action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student._id}>
                    <td>{student.EnrollmentCode}</td>
                    <td>{student.StudentName}</td>
                    <td>{student.BusNumber}</td>
                    <td>{student.StopName}</td>
                    <td>
                      <button
                        onClick={() => handlePrint(getRowHTML(student, 'student'), language)}
                      >
                        {translations[language].print}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">{translations[language].noStudents}</td>
                </tr>
              )}
            </tbody>
          </table>

          <h3>{translations[language].filteredBuses}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>{translations[language].busNumber}</th>
                <th>{translations[language].route}</th>
                <th>{translations[language].capacity}</th>
                <th>{translations[language].brand}</th>
                <th>{translations[language].action}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.length > 0 ? (
                filteredBuses.map(bus => (
                  <tr key={bus._id}>
                    <td>{bus.Busno}</td>
                    <td>{bus.Route}</td>
                    <td>{bus.Capacity}</td>
                    <td>{bus.Brand}</td>
                    <td>
                      <button
                        onClick={() => handlePrint(getRowHTML(bus, 'bus'), language)}
                      >
                        {translations[language].print}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">{translations[language].noBuses}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllocatedDetails;
