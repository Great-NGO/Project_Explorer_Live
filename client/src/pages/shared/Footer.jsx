import React from "react";
import { ArrowUpSquareFill } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <>
      {/* <footer className="container w-75"> */}
      <footer className="container">
        <div className="footerDiv">
          <p className="text-muted pt-2">
            {/* Project Explorer &#64; 2022 <strong>NGO-TECH Edconnect </strong> */}
            Project Explorer &#64; 2022 <a href="https://greatngo.disha.page/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none", color: "#0d69a1", fontWeight:"700", paddingRight:"5px" }}>NGO-TECH</a>
            <span> <ArrowUpSquareFill size={30} style={{cursor: "pointer", color:"#0d69a2"}} onClick={ () => window.scrollTo({top: 0, behavior: "smooth"})} /> </span> 

          </p>
        </div>
      </footer>
    </> 
  );
};
export default Footer;