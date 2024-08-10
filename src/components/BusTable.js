import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BusTable.css';

const BusTable = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/buses');
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching bus data:', error);
    }
  };

  return (
    <div className="bus-table-container">
      <h2>Bus Details</h2>
      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus No</th>
            <th>Bus Sr No</th>
            <th className='sto'>Stop 1</th>
            <th className='sto'>Stop 2</th>
            <th className='sto'>Stop 3</th>
            <th className='sto'>Stop 4</th>
            <th className='sto'>Stop 5</th>
            <th className='sto'>Stop 6</th>
            <th className='sto'>Stop 7</th>
            <th className='sto'>Stop 8</th>
            <th className='sto'>Stop 9</th>
            <th className='sto'>Route</th>
            <th className='sto'>Seat</th>
            <th className='sto'>Capacity</th>
            <th className='sto'>Brand</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus, index) => (
            <tr key={index}>
              <td>{bus.Busno}</td>
              <td>{bus.BusSrNO}</td>
              <td className='hexco'>{bus.stop1}</td>
              <td className='hexco'>{bus.stop2}</td>
              <td className='hexco'>{bus.stop3}</td>
              <td className='hexco'>{bus.stop4}</td>
              <td className='hexco'>{bus.stop5}</td>
              <td className='hexco'>{bus.stop6}</td>
              <td className='hexco'>{bus.stop7}</td>
              <td className='hexco'>{bus.stop8}</td>
              <td className='hexco'>{bus.stop9}</td>
              <td>{bus.Route}</td>
              <td>{bus.Seat}</td>
              <td>{bus.Capacity}</td>
              <td>{bus.Brand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusTable;
