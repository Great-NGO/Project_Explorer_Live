import React, { useEffect, useReducer, useState } from "react";
import Layout from "./shared/Layout";
import { Form, Col, Button, Container, Alert, Row } from "react-bootstrap";
import useFetch from "../services/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/auth";
import { reducer } from "../reducers/continueSignup";
import axios from "axios";
import Loader from "../components/Loader";
const { setWithExpiry } = AuthService;

const ContinueSignup = () => {
  
    const params = useParams();
    let navigate = useNavigate();

   //Is Loading state for Loader component
   const [isLoading, setIsLoading] = useState(false)

    let initialState = {
        password: '',
        matricNumber: '',
        program: '',
        graduationYear: '',
        error: [],
        
    }

//Use custom hook - useFetch to populate data for programs and graduation years
const programData = useFetch('/api/programs');
const gradYearData = useFetch('/api/graduationYears');

// Invoking the useReducer hook and extracting input elements from our state
const [state, dispatch] = useReducer(reducer, initialState);
let { program, graduationYear, matricNumber, password, error } = state;


let userId = params.id;
const { getCurrentUser } = AuthService;

useEffect(() => {
    console.log("The new User ID from google is ", userId)
    const user = getCurrentUser();
    console.log("The user is: ", user)
    // Run the dispatch function which loads our details
    dispatch({type: 'loadContinueSignupDetails', data:user})

  }, [getCurrentUser, userId])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(`${name} : ${value}`);

    dispatch({type: 'field', fieldName:name, payload: value})

  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsLoading(true)

    let formData = { password, matricNumber, program, graduationYear };
    try {
        const res = await axios.put(`/api/continueSignup/${userId}`, formData, { headers: { "Content-Type": "application/json" }} )   
        console.log("The res ", res);
        const data = res.data;

        console.log("The data ", data);
        //Redirect to the home page if everything is okay
        if(data.status==="OK") {
          setWithExpiry("user", data.user);
          navigate("/");  
        }
    } catch (error) {
      console.log("THE ERR ", error + "THE ERR response ", error.response)
      let { errors } = error.response.data;
      dispatch({type: 'error', payload:errors})
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <>
        <Container fluid="md">
          <main className="border rounded p-5 mt-5">
            <Form onSubmit={handleSubmit} id="continueSignupForm" >
              <h1>Please Continue Sign Up</h1>



              <Row>
                 {/* Show error */}
                 {error.length > 0 ? 
                          <Alert variant="danger" onClick={(evt) => dispatch({type: 'clearErrorAlert'})} style={{cursor: "pointer", fontWeight: "700"}} >
                            {error[0]}
                          </Alert>
                        : null
                  }

              <Form.Group as={Col} controlId="formGridPassword" sm={6}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    name="password"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridProgram" sm={6}>
                  <Form.Label>Program</Form.Label>
                  <Form.Control
                    as="select"
                    // defaultValue="Choose..."
                    value={program}
                    name="program"
                    onChange={handleInputChange}
                  >
                    <option>Choose...</option>
                    {programData &&
                      programData.map((progData) => (
                        <option key={progData}>{progData}</option>
                      ))}
                  </Form.Control>
                </Form.Group>

                </Row>
                
                <Row>
                <Form.Group as={Col} controlId="formGridMatricNo" sm={6}>
                  <Form.Label>Matriculation Number</Form.Label>
                  <Form.Control
                    placeholder="e.g 16/2020"
                    value={matricNumber}
                    name="matricNumber"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridGradYear" sm={6}>
                  <Form.Label>Graduation Year</Form.Label>
                  <Form.Control
                    as="select"
                    // defaultValue="Choose..."
                    value={graduationYear}
                    name="graduationYear"
                    onChange={handleInputChange}
                  >
                    <option>Choose...</option>
                    {gradYearData &&
                      gradYearData.map((gradYData) => (
                        <option key={gradYData}>{gradYData}</option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Row>

              <Button variant="success" type="submit" className="mt-1">
                Submit
              </Button>

              {isLoading ? <Loader size={"80px"} /> : "" }
              

            </Form>
          </main>
        </Container>
      </>
    </Layout>
  );
};

export default ContinueSignup;
