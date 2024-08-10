import React from 'react';
import './StudentDetails.css';
import UploadFile from './components/UploadStudent.js' ;
import Studenttable from'./components/StudentTable.js';
function StudentDetails() {
    return(
        <div className="student-from">
           <header> 
     
     <h3>Student Details <br/> <h6>by krbus</h6></h3>
   </header>   
 <UploadFile />  

  <Studenttable/>
        </div>
    );
} 
export default StudentDetails;