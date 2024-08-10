// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';

import Layout from './components/Layout';
import StudentDetails from './StudentDetails'; 
import BusDetails from './components/Busdetails.js'; 
import AllocatedDetails from './components/AllocatedDetails.js'; 

const App = () => {
  return (
    <Router>
      <Layout>
     
        <Routes>
          <Route path="/" element={<Dashboard />} />
       
          <Route path="/studentdetails" element={<StudentDetails/>} />
          {/* <Route path="/student-details" element={< />} /> */}
          <Route path="/Busdetails" element={<BusDetails />} />  
          <Route path="/AllocatedDetails" element={<AllocatedDetails/>}/>
      


       
        </Routes>
      </Layout>

    </Router>
  );
};

export default App;
