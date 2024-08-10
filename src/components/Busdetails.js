import React from "react";
import UploadBus from "./UploadBus"; 
import "./uploadbus.css";
import Bustable from "./BusTable";
function Busdetails(){ 
    return( 
        <div> 
            <header> 
     <h3>Busdetails <br/> <h6> by krbus</h6></h3>
   </header> 
   <UploadBus/>
            <br/>
            <Bustable/>
        </div>
    );
 
} 
export default Busdetails;