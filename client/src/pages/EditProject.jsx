import React, { useState, useReducer, useEffect } from "react";
import Layout from "./shared/Layout";
import { Button, Container, Form, Alert, Modal, Navbar,  } from "react-bootstrap";
import AuthService from "../services/auth";
import { useNavigate, useParams } from "react-router-dom";
//Import reducer function to be used my useReducer hook
import { reducer } from "../reducers/editProject";


const EditProject = () => {
  //Invoking Params and Navigate method from react-router-dom
  let navigate = useNavigate();
  const params = useParams();

  // const { getCurrentUser, isUserProjectOwner } = AuthService;

  //Initial states (useReducer hook to handle Change and show initial values)
  let initialState = {
    name: '',
    abstract: '',
    authors: [],
    tags: [],
    createdBy: '',
    profilePicture: '',
    error: []
  }
  const [createdAt, setCreatedAt ] = useState('');
  const [updatedAt, setUpdatedAt ] = useState('');
  const [createdById, setCreatedById] = useState('');

   // To confirm Delete project
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let projectId = params.id;
  useEffect(() => {
    // Getting the getCurrentUser method
    const { getCurrentUser, isUserProjectOwner } = AuthService;

    console.log(`The Project Id is: ${projectId}`);
    //If User isn't logged in.. Redirect to login page ... (This might never happen since a user can only get here from the project) and If the user isn't the Project owner 
    if (!getCurrentUser()) {
      navigate("/login", true);
    }
   
    try {
        //Populating the edit field
    fetch(`/api/project/${projectId}`)
    .then(async (response) => {
      const res = await response.json();
      const data = res.project;
      console.log('The project ', data);
      //To run the dispatch function which would load all our apps initial data
      dispatch({type: 'loadProjectDetails', data:data})
       // CreatedAt Date and UpdatedAt Date and CreatedById (Extra check to make sure route is inaccessible by users who aren't the project owners)
      setCreatedAt(new Date(data.createdAt).toLocaleDateString('en-GB'))
      setUpdatedAt(new Date(data.updatedAt).toLocaleDateString('en-GB'))
      setCreatedById(data.createdBy._id)
    })
    } catch (error) {
      console.log(error)
    }
  

    // //If user is not the Project owner redirect to the project page.. User might never hit this route, but just to handle it.
    console.log(`is user project owner `, isUserProjectOwner(createdById))
    // if(isUserProjectOwner(createdById) === false) {
    //   navigate(`/projects/${projectId}`, true)
    // }

  }, [navigate, projectId, createdById]);


  //Invoking the useReducer hook and extracting input elements from our state
  const [state, dispatch] = useReducer(reducer, initialState);
  let { name, abstract, authors, tags, createdBy, profilePicture, error } = state;  

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    console.log(`${name} : ${value}`);
    if(name === "authors") {
      authors = value.split(',').filter((author) => author !== "")
      dispatch({ type: 'authors', fieldName:name, payload: value})
    }
    else if (name === "tags") {
         //We make sure that no empty string with "" is saved to our array, so we use the filter method
         tags = value.split("#").filter((tag) => tag !== "");
         dispatch({ type: 'tags', fieldName:name, payload: value})
    }

    dispatch({ type: 'nameAndAbstract', fieldName:name, payload: value})
    
  }

  //Handle Update function
  const handleUpdateSubmit = (evt) => {
    evt.preventDefault();
    console.log("Submitted")

    let formData = { name, abstract, authors, tags }
    fetch(`/api/editProject/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      const data = await res.json();
      console.log("The data from the edit is: ", data)
      console.log("UPDATE SUCCESS");
      if(data.errors) {
        dispatch({type: 'error', payload:data.errors})
      }
    })
    
  }

  const handleDeleteProject = (evt) => {
    evt.preventDefault();
    console.log("Deleted")

    fetch(`/api/deleteProject/${projectId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      const data = await res.json();
      console.log('The data from the delete is: ', data)
      if(data.errors) {
        setShow(false);
        dispatch({type: 'error', payload:data.errors})
      } else {
        // window.location = "/"
        navigate('/', {replace: true} )

      }
    })
  }

  return (
    <Layout>
      <Container>
      <nav className="container" id="headerNav">
            <div>
              <h1 id="project_name">{name}</h1>
            </div>

            <Navbar collapseOnSelect expand="md" style={{backgroundColor: "lightgray"}}>
              <Container>
              <Navbar.Brand>
                <img src={profilePicture} alt="" className="defaultProfilePic" style={{ borderRadius: '50%', width: '65px', height: '65px', }} />
              </Navbar.Brand>

              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                
              <nav className="container">
                <div className="row align-items-center">
                  <div className="col-md-10">
                    <div className="row">
                    
                      <div className="col-md-4">
                        Created by
                        <p> <strong>{createdBy}</strong></p>
                      </div>

                      <div className="col-md-4">
                        Date Created
                        <p> {createdAt} </p>
                      </div>

                      <div className="col-md-4">
                        Last Updated
                        <p> {updatedAt}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                      <a className="btn btn-primary" href={`/projects/${projectId}`} id="viewBtn">
                        View Project 
                      </a>                   
                  </div>
                </div>
              </nav>

              </Navbar.Collapse>
              </Container>
            </Navbar>
           
      </nav>

      <section className="container">

        <div className="row mx-5">
            <div className="col-md-8 mt-1">
                <h3>Edit Project</h3>
                <hr />

              {/* Show error */}
              {error.length > 0 ? 
                <Alert variant="danger" onClick={(evt) => dispatch({type: 'clearErrorAlert'})} style={{cursor: "pointer", fontWeight: "700"}} >
                  {error[0]}
                </Alert>
                : null
              }

                <Form onSubmit={handleUpdateSubmit}>

                  <Form.Group controlId="Form.ControlInput1">
                      <Form.Label> Project Name</Form.Label>
                      <Form.Control type="text" name="name" value={name} placeholder="Enter Project name" onChange={handleInputChange} />
                  </Form.Group>
                      
                  <Form.Group controlId="Form.ControlTextarea1">
                      <Form.Label> Project Abstract</Form.Label>
                      <Form.Control as="textarea" name="abstract" value={abstract} placeholder="Enter Details about the project" rows={6} onChange={handleInputChange} />
                  </Form.Group>
                    
                  <Form.Group controlId="Form.ControlInput2">
                      <Form.Label> Authors </Form.Label>
                      <Form.Control type="text" name="authors" value={authors} placeholder="Enter author(s) names (separated by comma)" onChange={handleInputChange} />
                  </Form.Group>
                      
                  <Form.Group>
                      <Form.Label> Tags</Form.Label>
                      <Form.Control type="text" name="tags" value={tags} placeholder="Use # to tag project with different topics (e.g. #javascript)" onChange={handleInputChange} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-1">
                      Update
                  </Button>
                </Form>

            </div>

            <div className="col-md-4 mt-1">
                <h3>Manage Project files</h3>
                <hr />  

                {/* Confirm Delete project action */}

                <button className="btn btn-danger" onClick={handleShow}> Delete Project </button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                      <Modal.Title> <h2 style={{color:'red'}}> DELETE PROJECT </h2> </Modal.Title>
                    </Modal.Header>
                    <Modal.Body> 
                        <h3>Are you sure you want to delete this project?</h3>
                        <p>You can't undo this action once done</p>
                      </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Cancel
                      </Button>
                      
                      <Form onSubmit={handleDeleteProject}>
                      <Button variant="danger" type="submit">
                        Confirm
                      </Button>
                      </Form>
                      
                    </Modal.Footer>

                </Modal>                           

            </div>

        </div>

      </section>

      </Container>
    </Layout>
  );
};

export default EditProject;
