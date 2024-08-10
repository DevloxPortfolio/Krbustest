import React, { useState } from 'react';
import '../Sidebar.css';
import logo from '../asset/logo.svg';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isClosed, setIsClosed] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsClosed(!isClosed);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode);
  };

  return (
    <nav className={`sidebar ${isClosed ? 'close' : ''}`}>
      <header>
        <div className="image-text">
          <span className="image">
            <img src={logo} alt="Logo" />
          </span>

          <div className="text logo-text">
            <span className="name">KR Public School</span>
            <span className="profession">Devlox.online</span>
          </div>
        </div>
        <i className="fas fa-chevron-right toggle" onClick={toggleSidebar}></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <NavLink to="/" activeClassName="active">
                <i className="fas fa-home icon"></i>
                <span className="text nav-text">Dashboard</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to="/studentdetails" activeClassName="active">
               <i class="fa-solid fa-file-invoice icon"></i>
                <span className="text nav-text">Student Details</span>
              </NavLink>
            </li>
            <li className="nav-link">
              <NavLink to="/Busdetails" activeClassName="active">
              <i class="fa-solid fa-bus icon"></i>
                <span className="text nav-text">Bus Details</span>
              </NavLink>  
            </li>
            <li className="nav-link">
              <NavLink to="/AllocatedDetails" activeClassName="active">
              <i class="fa-solid fa-gear icon"></i> 
                <span className="text nav-text">Bus Allocation</span>
              </NavLink>  
            </li>
           
            
          </ul>
        </div>

        <div className="bottom-content">
          <li>
            <i className="fas fa-sign-out-alt icon"></i>
            <span className="text nav-text">Logout</span>
          </li>

          {/* <li className="mode">
            <div className="sun-moon">
              <i className="fas fa-moon icon moon"></i>
              <i className="fas fa-sun icon sun"></i>
            </div>
            <span className="mode-text text">Dark mode</span>

            <div className="toggle-switch" onClick={toggleDarkMode}>
              <span className="switch"></span>
            </div>
          </li> */}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
