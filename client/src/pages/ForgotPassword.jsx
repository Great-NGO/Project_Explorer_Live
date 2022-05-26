import React, { useReducer, useState } from "react";
import Layout from "./shared/Layout";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { reducer } from "../reducers/forgotPassword";
// import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

  // let navigate = useNavigate();

  const initialState = {
    error: '',
    email: '',
    successMsg: true
  }
  const [onSubmitMsg, setOnSubmitMsg] = useState('')

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, successMsg, error } = state;

  const handleSubmit = (evt) => {
    evt.preventDefault();

    fetch('/api/forgotPassword', {
      method: "POST",
      body: JSON.stringify({ email}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
    .then((data) => {
      console.log("DAta ", data);

      if (data.error) {
        dispatch({type: 'error', payload:data.error})
      } else {
        setOnSubmitMsg(data.message)

        // setTimeout(() => {
        //   navigate('/login', true)
        // }, 2000);
      }
    })
  }

  const handleInputChange = (evt) => {
    let {name, value } = evt.target;
    value = value.trim();
    console.log(`${name} : ${value}`);
    dispatch({ type: 'field', fieldName: name, payload: value})
  }

  return (
    <Layout>
      <>
        <Container fluid="md">
          <main className="border rounded p-5 mt-5" >
            <h1>Forgot Password?</h1>

            <Form onSubmit={handleSubmit}>
              
              {successMsg ? 
                <Alert variant="info">
                  Enter your email address to begin the password reset process.
                </Alert>
              : null}
              
              {error ?              
                  <Alert variant="danger" key={error} onClick={() => dispatch({type:'clearAlert'})}> 
                      {error}
                  </Alert>
                : null
              }

              {onSubmitMsg !==""?
                <Alert variant="info">
                  {onSubmitMsg}
              </Alert> : null
              }

              <Form.Group controlId="formBasicEmail">
                <Form.Label size="lg">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  name="email"
                  onChange={handleInputChange}
                  // onBlur={(evt) => dispatch({type: 'success'}) }
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-2">
                Submit
              </Button>
              <span className="mx-2">
                <a className="login" href='/login' style={{fontWeight:"500"}}>Login</a>
              </span>
            </Form>
          </main>
        </Container>
      </>
    </Layout>
  );
};
export default ForgotPassword;
