import React, { useState, useEffect, useContext } from "react";
import { Nav, Navbar, Container, Form, FormControl, Button, } from "react-bootstrap";
import AuthService from '../../services/auth';
// import { BellFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/ReferenceDataContext";
import { useRef } from "react";

const Header = () => {

  // Using the useRef hook
  const search = useRef(null);    //To access the DOM directly and to be able to manipulate/use the value of the dom element we'd make a reference to

  const { getCurrentUser, logout } = AuthService;
  const [usernameText, setUsernameText] = useState('')
  const [userId, setUserId ] = useState('');

  let navigate = useNavigate()

  const clickLogout = () => {
    logout()
    navigate('/login')  //To redirect the user back to the login page once they logout
  }

  const usernameStyle = {
    display: "inline-block",
    color: "white",
    paddingTop: "8px",
    marginRight: "6px"
  };

  const profPicStyle = {
    borderRadius: "50%", 
    width: "35px", 
    height: "35px", 
    marginTop: "-2px", 
    paddingLeft: "5px"
  }

  console.log("The getCurrent user ", getCurrentUser());

  //Using the UseContext hook
  const {firstname } = useContext(UserContext).value1;
  const {profilePicture} = useContext(UserContext).value2;

  useEffect(() => {
    const authenticated = AuthService.getCurrentUser();
   
    async function fetchUserData(id) {
      const response = await axios.get(`/api/v1/user/${id}`)
      return response.data
    }

    if(authenticated){

      fetchUserData(authenticated._id)
        .then(data => {
          console.log("ANOTHER DATA", data) 
          let { user } = data;
          console.log('The user is ', user)
          setUsernameText(`Hi, ${firstname}`);
          setUserId(user._id)
        })

    }
  }, [firstname])

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const {value } = search.current;  //To get the value of the DOM Input search element
    navigate(`/search?search=${value}&searchBy=name`)
  }
  

  // console.log("The firstname ", firstname)
  return (

    
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="p-2">
      <Container>
        <Navbar.Brand href="/">Project Explorer</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto pt-2">
            <Form className="d-flex" onSubmit={handleSubmit}>
              <FormControl
                // type="search"
                name="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                ref={search}    //DOM element we are making reference to get the value.
              />
              <Button type="submit" variant="outline-success" >Search</Button>
            </Form>
            <Nav.Link href="/search">Discover Projects</Nav.Link>
            <Nav.Link href="/projects/submit">Submit Project</Nav.Link>
          </Nav>
          
          <Nav className="pt-1">
          { getCurrentUser() !== null? (
            <>
              <span style={usernameStyle}>
                <a href={`/editProfile/${userId}`} style={{textDecoration: 'none', color: '#B5B5B5'}}> 
                  {usernameText} 
                  <img src={profilePicture} alt="Profile" className="card-img-top" style={profPicStyle} />
                </a>
              </span>
              <Nav.Link onClick={clickLogout} style={{marginRight: '10px'}}>
                Logout
              </Nav.Link>
            </>
            ) :      
            <>
              <Nav.Link href="/signup">Signup</Nav.Link>
              <Nav.Link eventKey={2} href="/login">
                Login
              </Nav.Link>
            </>
          }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
  );
};
export default Header;
