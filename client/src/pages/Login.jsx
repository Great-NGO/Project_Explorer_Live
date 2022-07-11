import React, {useContext, useReducer, useState} from "react";
import Layout from "./shared/Layout";
import {Form, Button, Container, Alert} from "react-bootstrap";
// import { Facebook } from "react-bootstrap-icons"; 
import { useNavigate, generatePath } from 'react-router-dom';
import { UserContext } from "../context/ReferenceDataContext";
import AuthService from "../services/auth";
import { GoogleLogin } from "@react-oauth/google";
import Loader from "../components/Loader";
// import FacebookLogin from 'react-facebook-login';

const {setWithExpiry } = AuthService

const Login = () => {

  //Initialize useNavigate
  let navigate = useNavigate();

  //Is Loading state for Loader component
  const [isLoading, setIsLoading] = useState(false)

  const initialState = {
    error: '',
    email: '',
    password: ''
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'field': {
        return {
          ...state,
          error: '',  //To clear the error
          [action.fieldName]: action.payload
        }
      }
      case 'error': {
        return {
          ...state,
          error: action.payload
        }
      }
      case 'clearErrorAlert': { //To clear the Error Alert each time a user clicks on it
        return {
          ...state,
          error: ''
        }
      }
      default:
        return state;
    }
  }

  const handleInputChange = (evt) => {
    console.log(`${evt.target.name} : ${evt.target.value}`);
    dispatch({ type: 'field', fieldName: evt.target.name, payload: evt.target.value})
  }

  // const [facebookLoginData, setFacebookLoginData] = useState(
  //   localStorage.getItem('facebookLoginData') ? JSON.parse(localStorage.getItem('facebookLoginData')) : null
  // )

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password } = state;

  //Use the useContext hook, get the setFirstname and setProfile picture from it
  const {setFirstName } = useContext(UserContext).value1;
  const { setProfilePicture } = useContext(UserContext).value2;
  
  const handleSubmit = (evt) => {
    evt.preventDefault();
    setIsLoading(true)

    fetch('/api/v1/login', {
      method: "POST",
      body: JSON.stringify({ email, password}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);

      if(data.status === "Login OK") {
        console.log('LOGGED IN SUCCESSFULLY'); 

        //Set the global state of the users firstname and profile picture when they login
        setFirstName(data.user.firstname);
        setProfilePicture(data.user.profilePicture);
        //Set the user info in local storage with timer
        setWithExpiry("user", data.user)
        // Redirect User to Home page
        navigate('/',true) 
      }
      else {
        console.log(data.error);
        dispatch({ type: 'error', payload: data.error})
        setIsLoading(false)


      }
    })
  }

  /* GOOGLE AUTH CODES */

  // For Google
  
    const handleGoogleClick = async (response) => {
      console.log("The Google data ", response);
      const res = await fetch("/api/v1/google-login", {
        method: "POST",
        body: JSON.stringify({
          credential: response.credential
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await res.json();
      console.log("The data from Google button - ", data);
  
      if (data.status === "OK") {
        if (
          data.redirectToContinueSignup === false &&
          data.user.matricNumber !== undefined &&
          data.user.graduationYear !== undefined
        ) {
          console.log("WOW from Google Component ");
          setFirstName(data.user.firstname);
          setProfilePicture(data.user.profilePicture);
          setWithExpiry("user", data.user);
          //Redirect User to Home Page
          navigate("/");
        } else {
          console.log("User has not been signed up before");
          //Redirect User to the Continue Signup page
          let id = data.user._id;
  
          setFirstName(data.user.firstname);
          setProfilePicture(data.user.profilePicture);
          setWithExpiry("user", data.user);
  
          const path = generatePath("/continueSignup/:id", { id: id });
          console.log("The path ", path);
  
          navigate(path, { replace: true });
        }
      } else {
        console.log("The error ", data.error);
        dispatch({ type: "error", payload: data.error });
      }
    };
  
 

  // const handleFacebookLogin = async(facebookData) => {
  //   console.log("The Facebook Login data ", facebookData);
  //   const res = await fetch('/api/facebook-login', {
  //     method: "POST",
  //     body: JSON.stringify({
  //       accessToken: facebookData.accessToken,
  //       userID: facebookData.userID
  //     }), 
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   })

  //   const data = await res.json();
  //   console.log("Facebook login success, client-side ", data);
  //   setFacebookLoginData(data);
  //   localStorage.setItem('facebookLoginData', JSON.stringify(data));

  // }

  return (
    <Layout>
        <Container fluid="md">

          <main className="mx-auto border rounded p-5 mt-5" style={{width:"90%"}}>
                        
            <Form onSubmit={handleSubmit}>

              <h1>LOGIN</h1>

              {/* Login error */}
              {state.error? 
                <Alert variant="danger" onClick={(evt) => dispatch({type: 'clearErrorAlert'})} style={{cursor: "pointer", fontWeight: "700"}}>
                  {state.error}
               </Alert>
               : null
              }
                 
              <Form.Group controlId="formBasicEmail">
                <Form.Label size="lg">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleInputChange}
                />
              </Form.Group>


              <Button variant="success" type="submit" className="mt-2">
                Login
              </Button>


              <span className="mx-2">

                <a className="forgotPassword" href="/forgotPassword" style={{fontWeight:"500", color:"#198754", fontSize:"16px"}}>
                  Forgot Password?
                </a>

              {isLoading ? <Loader size={"70px"} /> :  ""}

              </span>
            </Form>

            <div className="socialLogin mt-2 ">
              {/* <Form> */}
                {/* <Button variant="primary" type="submit">
                  <span> <Facebook size={22} /> </span>
                  <a href="#/auth/facebook" style={{color:"white", textDecoration: "none"}} > Login with Facebook  </a>
                </Button> */}
              {/* </Form> */}

              {/* <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                autoLoad={true}
                // autoLoad={false}
                callback={handleFacebookLogin}
              >
              </FacebookLogin> */}

              <GoogleLogin
                  onSuccess={(credentialResponse) => {   
                    console.log("Response -- ", credentialResponse)     
                    handleGoogleClick(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                    alert("Failed to sign up with Google. Something went wrong")
                  }}
              
                />


            </div>
              
      
          </main>
        </Container>
    </Layout>
  );
};

export default Login;
