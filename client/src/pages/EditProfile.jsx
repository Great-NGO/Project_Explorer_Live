import React, { useReducer, useEffect, useContext } from "react";
import Layout from "./shared/Layout";
import { Button, Container, Form, Navbar, Alert } from "react-bootstrap";
import AuthService from "../services/auth";
import { useParams } from "react-router-dom";
//Import reducer function to be used my useReducer hook
import { reducer } from "../reducers/editProfile";
import axios from 'axios';
import { UserContext } from "../context/ReferenceDataContext";
import useFetch from "../services/useFetch";


const EditProfile = () => {
  //Invoking Params and Navigate method from react-router-dom
  const params = useParams();

  //Initial states (useReducer hook to handle Change and show initial values)
  let initialState = {
    lastname: '',
    email: '',
    matricNumber: '',
    program: '',
    graduationYear: '',
    // profilePicture: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    error: [],
    error2: [],
    successMessage: false,
    passwordUpdateSuccessMsg: false,
  }

 //We use custom hook - useFetch to populate data for programData and graduationYears from their respective APIs
 const programData = useFetch('/api/programs');
 const gradYearData = useFetch('/api/graduationYears');

  //Using the UseContext hook
const {firstname, setFirstName } = useContext(UserContext).value1;
const {setProfilePicture } = useContext(UserContext).value2;
console.log(firstname);

//Invoking the useReducer hook and extracting input elements from our state
const [state, dispatch] = useReducer(reducer, initialState);
let { lastname, email, matricNumber, program, graduationYear, profilePicture, currentPassword, newPassword, confirmNewPassword, error, successMessage, error2, passwordUpdateSuccessMsg } = state;

let userId = params.id;
const { getCurrentUser, setWithExpiry } = AuthService;

useEffect(() => {
  console.log(`The User Id is ${userId}`);
  const user = getCurrentUser();
  console.log("The user is: ", user)
  //Run the dispatch function which loads our details
  dispatch({type: 'loadProfileDetails', data:user})

}, [getCurrentUser, userId])


const handleInputChange = (evt) => {
    let { name, value } = evt.target;
    console.log(`${name} : ${value}`);
    value =value.trim()

    if(name === 'firstname') {
      setFirstName(value)
    }
    dispatch({ type: 'field', fieldName:name, payload: value})

}

  const handleFileChange = (evt) => {
    const {name, value, files} = evt.target;
    console.log("Event", evt + "Value", value);

    dispatch({type: 'profilePicture', fieldName:name, payload:files[0]})
  }
  console.log("Profile pic", profilePicture)

  //Handle Update Profile function
  const handleUpdateUserProfile = async (evt) => {
    evt.preventDefault();

    let formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("matricNumber", matricNumber);
    formData.append("program", program);
    formData.append("graduationYear", graduationYear);
    formData.append("profilePicture", profilePicture);

    console.log("Handle Update user profile.. The FORMDATA ", formData)

    try {
      const res = await axios.put(`/api/editProfile/${userId}`, formData, { headers: { "Content-Type": "multipart/form-data" }})
      console.log("The RESSS", res)
      let updatedUser = res.data.user;
      console.log("The updated User ", updatedUser)

      setProfilePicture(updatedUser.profilePicture);
      setWithExpiry("user", updatedUser)
      // localStorage.setItem("user", JSON.stringify(updatedUser));

      dispatch({type: 'success'})


    } catch (error) {
      //Axios returns the actual error in error.response
      console.log("THE ERR ", error + "THE ERR response ", error.response)
      let { errors } = error.response.data;
      dispatch({type: 'error', payload:errors})

    }
    
  }

  const removeProfilePicture = async (evt) => {
    evt.preventDefault();
    console.log('Remove profPic was clicked');

    try {
      const res = await axios.put(`/api/removeProfilePicture/${userId}`)
      let { user } = res.data;
      console.log("The user ", user)
      setProfilePicture(user.profilePicture)
      setWithExpiry("user", user )

    }
    catch (err) {
      console.log("Error response ", err.response);
      let { errors } = err.response.data;
      dispatch({type: 'error', payload: errors})
    }

  }

  //Handle Update Password function
  const handleUpdatePassword =async  (evt) => {
    evt.preventDefault();
    console.log("handle Update User password")

    let formData = { currentPassword, newPassword, confirmNewPassword }

    try {
      const res = await axios.put(`/api/editProfile/password/${userId}`, formData, { headers: { "Content-Type": "application/json" }})
      console.log("REs ", res)
      dispatch({type: 'passwordSuccess'})
      

    } catch (error) {
      console.log("ERRR", error.response)
      let {errors} = error.response.data;
      dispatch({type: 'passwordError', payload:errors})
    }
    
  }


//Handle Delete User
const handleShow = (evt) => {
    console.log("Delete user clicked")
}

  return (
    <Layout>
      <Container>

        <nav className="container" id="headerNav">
            <div>
              <h1 id="project_name">
                <span id="user_name"> {`${firstname} ${lastname}`} </span>
                  <small> {email} </small>
                </h1>
            </div>

            <Navbar collapseOnSelect expand="md" style={{backgroundColor: "lightgray"}}>
              <Container>

              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                
              <nav className="container">
                <div className="row align-items-center">
                  <div className="col-md-10">
                    <div className="row">
                    
                      <div className="col-md-4">
                        Program
                        <p> <strong>{program}</strong></p>
                      </div>

                      <div className="col-md-4">
                        Matriculation Number
                        <p> {matricNumber} </p>
                      </div>

                      <div className="col-md-4">
                        Graduation Year
                        <p> {graduationYear}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                      <button className="btn btn-danger" onClick={handleShow}> Delete Account </button>
                  </div>
                </div>
              </nav>

              </Navbar.Collapse>
              </Container>
            </Navbar>
           
        </nav>

        <section className="container">
            <div className="row">
                <div className="col-md-12 update_profile" id="update_profile" style={{marginTop:'15px'}}>
                  <h4>Update Profile</h4>
                  <hr></hr>
                  
                  <div className="container">

                    {/* success Message */}
                      {successMessage? 
                        <Alert variant="info" style={{cursor: "pointer", fontWeight: "700"}} onClick={(evt) => dispatch({type: 'clearSuccessAlert'})} >
                          <strong> Your Account Profile has been updated successfully! </strong>  
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
 
                      <div className="row mx-5 my-3">

                          <Form onSubmit={handleUpdateUserProfile} encType={'multipart/form-data'}>

                                <div className="row col-md-12">

                                    <Form.Group className="col-md-6">

                                        <Form.Label> First Name </Form.Label>
                                        <Form.Control type="text" name="firstname" value={firstname} placeholder="Enter your First Name" onChange={handleInputChange} />
                                        
                                    </Form.Group>

                                    <Form.Group className="col-md-6">

                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" name="lastname" value={lastname} placeholder="Enter your Last Name" onChange={handleInputChange} />

                                    </Form.Group>

                                </div>

                                <div className="row col-md-12">
                                    <Form.Group controlId="Form.ControlInput2" className="col-md-6">

                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="email" name="email" value={email} onChange={handleInputChange} />

                                    </Form.Group>

                                    <Form.Group controlId="Form.ControlSelect1" className="col-md-6">

                                        <Form.Label>Program</Form.Label>
                                        <Form.Control as="select" name="program" onChange={handleInputChange} required >
                                        <option> {program}  </option>
                                        {programData &&
                                            programData.map((progData) => (
                                            <option key={progData}>{progData}</option>
                                        ))}
                                        </Form.Control>
                                    </Form.Group>

                                </div>

                                <div className="row col-md-12">

                                    <Form.Group controlId="Form.ControlInput1" className="col-md-6">

                                        <Form.Label>Matriculation Number</Form.Label>
                                        <Form.Control type="text" name="matricNumber" value={matricNumber} placeholder="Enter your matriculation number" onChange={handleInputChange} />

                                    </Form.Group>                          

                                    <Form.Group controlId="Form.ControlSelect2" className="col-md-6">

                                        <Form.Label >Graduation Year</Form.Label>

                                        <Form.Control as="select" name="graduationYear" onChange={handleInputChange} required>
                                            <option>{graduationYear}</option>
                                            {gradYearData &&
                                                gradYearData.map((gradYData) => (
                                                <option key={gradYData}>{gradYData}</option>
                                                ))}
                                        </Form.Control>

                                    </Form.Group>

                                </div>

                                <div className="row col-md-12">
                                    <Form.Group controlId="formFile" className="mb-3 col-md-12">
                                        <Form.Label>Profile Picture</Form.Label>
                                        <Form.Control type="file" name="profilePicture" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange}/>
                                    </Form.Group>
                                </div>

                                <div className="row col-md-12">
                                    <span className="col-md-12">
                                    <Button variant="primary" type="submit" className="">
                                        Update Profile
                                        </Button>
                                    </span>
                                </div>

                              </Form>

                              <div className="row col-md-12 mt-2">
                                    <span>
                                     <Button style={{backgroundColor: 'black'}} onClick={removeProfilePicture}> 
                                        Remove Profile Picture
                                      </Button>              
                                    </span>
                              </div>
                              
                        </div>

                  </div>
                </div>

              </div>

              <div className="row my-3">
                <div className="col-md-12">
                  <h4>Change Password</h4>
                  <hr></hr>                

                  <div className="container">
                       {/* Password success Message */}
                       {passwordUpdateSuccessMsg? 
                        <Alert variant="info" style={{cursor: "pointer", fontWeight: "700"}} onClick={(evt) => dispatch({type: 'clearSuccessAlert'})} >
                          <strong> Your Password has been updated successfully! </strong>  
                        </Alert>
                        : null
                      }

                       {/* Show error */}
                        {error2.length > 0 ? 
                          <Alert variant="danger" onClick={(evt) => dispatch({type: 'clearErrorAlert'})} style={{cursor: "pointer", fontWeight: "700"}} >
                            {error2[0]}
                          </Alert>
                          : null
                        }

                      <Form onSubmit={handleUpdatePassword}>

                        <div className="row mx-5">
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control type="password" name="currentPassword" placeholder="Current Password" value={currentPassword} onChange={handleInputChange} />
                                </Form.Group>
                            </div>
                           
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control type="password" name="newPassword" placeholder="Your new Password" value={newPassword} onChange={handleInputChange} />
                                </Form.Group>
                            </div>
                          
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" name="confirmNewPassword" placeholder="Confirm new Password" value={confirmNewPassword} onChange={handleInputChange} />
                                </Form.Group>
                            </div>
                        </div>
                        <div className="row mx-5 mt-2">
                        <Button variant="primary" type="submit" className="mx-3 col-md-2">
                            Change Password
                         </Button>
                        </div>
                      </Form>
                  </div>
                </div>
              </div>
  
              
        </section>

      </Container>
    </Layout>
  );
};

export default EditProfile;
