import React, { useReducer, useState } from "react";
import Layout from "./shared/Layout";
import { Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { reducer } from "../reducers/resetPassword";
import Loader from "../components/Loader";

const ResetPassword = () => {
  const params = useParams();
  let navigate = useNavigate()

  //Is Loading state for Loader component
  const [isLoading, setIsLoading] = useState(false)

  let userId = params.id;

  let initialState = {
      newPassword: '',
      confirmNewPassword: '',
      error: [],
      successMsg: false
  }

  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { newPassword, confirmNewPassword, error, successMsg } = state;

  const handleInputChange = (evt) => {
    let { name, value } = evt.target;
    console.log(`${name} : ${value}`);
    value = value.trim();

    dispatch({ type: 'field', fieldName:name, payload: value})

  };

  const handleResetPassword = async (evt) => {
      evt.preventDefault();
      setIsLoading(true);
      let config = {"Content-Type": "application/json"};
      try {
          const res = await axios.put(`/api/resetPassword/${userId}`, { newPassword, confirmNewPassword}, {headers: config})
          console.log("REs ", res);
          dispatch({type: 'success'});
          setIsLoading(false);
      }
      catch(error) {
          console.log("Error ", error);
          let { errors } = error.response.data;
          dispatch({ type: 'error', payload: errors})
          setIsLoading(false);
      }

  }


  return (
    <Layout>
      <>
        <Container fluid="md">
          <main className="border rounded p-5 mt-5">

            <Form onSubmit={handleResetPassword}>
              <h1>Reset Password</h1>

                     {/* Password success Message */}
                     {successMsg? 
                        <Alert variant="info" >
                          <strong> Password has been reset successfully! <span onClick={() => navigate('/login')} style={{cursor: "pointer", textDecoration: "underline"}}>Click here to login!</span> </strong>  
                        </Alert>
                        : null
                      }

                       {/* Show error */}
                        {error.length > 0 ? 
                          <Alert variant="danger" onClick={(evt) => dispatch({type: 'clearErrorAlert'})} style={{cursor: "pointer", fontWeight: "700"}} >
                            {error[0]}
                          </Alert>
                          : null
                        }

              <Form.Group controlId="formNewResetPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  name="newPassword"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>

              <Form.Group controlId="formConfirmResetPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  name="confirmNewPassword"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-2">
                Submit
              </Button>

              {isLoading ? <Loader size={"100px"} /> : "" }
              
              
            </Form>
          </main>
        </Container>
      </>
    </Layout>
  );
};
export default ResetPassword;
