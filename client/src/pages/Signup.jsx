import React,{ useState, useReducer} from "react";
import useFetch from "../services/useFetch";
import Layout from "./shared/Layout";
import { Form, Col, Button, Container, Row, Alert } from "react-bootstrap";
import { Facebook} from "react-bootstrap-icons";
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Import our Google Button component which handles Signup/Login with Google
import GoogleButton from "../components/GoogleButton";

const Signup = () => {

  //Initialize useNavigate
  let navigate = useNavigate()

  //We use custom hook - useFetch to populate data for programData and graduationYears
  const programData = useFetch('/api/programs');
  const gradYearData = useFetch('/api/graduationYears');
  
  console.log("Using custom useFetch Hook, Our ProgData and gradYearData - ", programData, gradYearData )
  //State for selected program and Graduation Year
  const [program, setProgram] = useState();
  const [graduationYear, setGraduationYear] = useState();


  //Reducer for signup
  const initialState = {
    isLoading: false,
    error: [],
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    matricNumber: '',
    loginLinkOpen: false
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'field': {
        return {
          ...state,
          error: [],    //To clear the error array each time a user edits an input
          [action.fieldName] : action.payload,
        };      
      }
      case 'success': {
        return {
          ...state,
          isLoading: false,
          loginLinkOpen: true,
          error: []
        };
      }
      case 'clearErrorAlert': { //To clear the Error Alert each time a user clicks on it
        return {
          ...state,
          error: []
        }
      }
      case 'error' : {
        return {
          ...state,
          error: action.payload
        }
      }
      default:
        return state;
    }
  }

  
  const [state, dispatch] = useReducer(reducer, initialState);
  const {firstname, lastname, email, password, matricNumber } = state;


  //On Submit event handler
  const handleSubmit = (evt) => {
    evt.preventDefault();

    fetch('/api/signup',  {
      method: "POST",
      body: JSON.stringify({ firstname, lastname, email, password, program, matricNumber, graduationYear }),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        console.log(res);
        return res.json()
      })
      .then((data) => {
        console.log("ThE POST DATA", data)
        if(data.status === "Signup OK") {
          console.log("Signup Successful");
          dispatch({ type: 'success'})
        }
        else {
          console.log(data.errors)
          dispatch({ type: 'error', payload: data.errors})
          console.log("The errors", state.error)
        }
      })

  }
  
  return (
    <Layout>
      <Container fluid="md">
        <main className="mx-auto mt-5 p-5 border" style={{width:"90%"}}>
          <Form onSubmit={handleSubmit}>


            {state.loginLinkOpen? 
              <Alert variant="info">
                <strong>New account has been successfully created. Please <span onClick={() => navigate('/login')} style={{cursor: "pointer", textDecoration: "underline"}}>Login!</span> </strong>  
              </Alert>
              : ''  
            }

            <h1>Sign Up</h1>
                             
            {/* To only show the first error from the error array for better user experience*/}
            {state.error.length > 0 ? 
                <Alert variant="danger" onClick={(evt) => dispatch({type: 'clearErrorAlert'})} style={{cursor: "pointer", fontWeight: "700"}}>
                  {state.error[0]}
               </Alert>
               : null
            }
                 

            <Row>
              <Form.Group as={Col} controlId="formGridFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  name="firstname"
                  value={firstname}
                  onChange={(evt) => dispatch({ type: 'field', fieldName: 'firstname', payload: evt.currentTarget.value}) }

                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  name="lastname"
                  value={lastname}
                  onChange={(evt) => dispatch({ type: 'field', fieldName: 'lastname', payload: evt.currentTarget.value}) }

                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} controlId="formGroupEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(evt) => dispatch({ type: 'field', fieldName: 'email', payload: evt.currentTarget.value}) }

                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(evt) => dispatch({ type: 'field', fieldName: 'password', payload: evt.currentTarget.value}) }

                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} controlId="formGridProgram">
                <Form.Label>Program</Form.Label>
                <Form.Control as="select"
                  name="program"
                  value={program}
                  onChange={(evt) => setProgram(evt.target.value) }
                
                >
                  <option>Choose...</option>
                  {programData && programData.map((progData) => (
                    <option key={progData}> {progData} </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridMatricNo">
                <Form.Label>Matriculation Number</Form.Label>
                <Form.Control
                  placeholder="e.g 16/2020"
                  value={matricNumber}
                  name="matricNumber"
                  onChange={(evt) => dispatch({ type: 'field', fieldName: 'matricNumber', payload: evt.currentTarget.value}) }

                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridGradYear">
                <Form.Label>Graduation Year</Form.Label>
                <Form.Control
                  as="select"
                  // defaultValue="Choose..."
                  value={graduationYear}
                  name="graduationYear"
                  onChange={(evt) => setGraduationYear(evt.target.value) }
                >
                  <option>Choose...</option>
                  {gradYearData &&
                      gradYearData.map((gradYData) => (
                        <option key={gradYData}>{gradYData}</option>
                      ))}
                </Form.Control>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit" className="mt-2">
              Submit
            </Button>
          </Form>

          <div className="socialLogin mt-3">
            {/* <Form> */}
            <Button variant="primary" type="submit">
              <span> <Facebook size={22} /> </span>
              <a href="/auth/facebook" style={{ color: "white", textDecoration: "none" }} >
                Signup with Facebook
              </a>
            </Button>
            {/* </Form> */}

            
          </div>

          <GoogleButton text={"Signup With Google"}></GoogleButton>

        </main>
      </Container>
    </Layout>
  );
};

export default Signup;
