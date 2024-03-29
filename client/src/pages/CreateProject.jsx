import React, {useReducer, useEffect, useState} from "react";
import Layout from "./shared/Layout";
import { Container, Form, Button, Alert } from "react-bootstrap";
import AuthService from '../services/auth';
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const CreateProject = () => {

  let navigate = useNavigate();

    //Is Loading state for Loader component
    const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const { getCurrentUser } = AuthService;

    //If User isn't logged in.. Redirect to login page
    if(!getCurrentUser()) {
      navigate('/login',true)
    }

  }, [navigate])
  
  let initialState = {
    name: '',
    abstract: '',
    authors: [],
    tags: [],
    error: []
  }

  const reducer = (state, action) => {
    switch(action.type) {

      case 'nameAndAbstract' : {
        return {
          ...state,
          error: [],
          [action.fieldName]:action.payload
        }
      }
      case 'authors' : {
        return {
          ...state,
          error: [],
          authors:action.payload
        }
      }
      case 'tags' : {
        return {
          ...state,
          error: [],
          tags:action.payload
        }
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
  let { name, abstract, authors, tags } = state;

  const handleInputChange = (evt) => {
    let {name, value} = evt.target
    console.log(`${name}: ${value}`)
    if(name === "authors") {

      authors = value.split(',').filter((author) => author !== "")
      console.log("Authors", authors)
      dispatch({ type: 'authors', fieldName:name, payload: value})
    }
    else if(name === "tags") {
      
      //We make sure that no empty string with "" is saved to our array, so we use the filter method
      tags = value.split("#").filter((tag) => tag !== "");
      console.log('TAGS', tags)

      dispatch({ type: 'tags', fieldName:name, payload: value})
    }
    // For handling name and abstract
    dispatch({ type: 'nameAndAbstract', fieldName:name, payload: value})
    
  }

  //On submit event handler
  const handleSubmit = (evt) => {
    evt.preventDefault();
    // Load Loader component
    setIsLoading(true);

    console.log('The authors', authors)
    
      let formData = { name, abstract, authors, tags }
      console.log("The form data",formData)
    
      fetch('/api/v1/projects/submit', {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((data) => {
          console.log('The DATA', data);
          if(data.status === "Submission OK"){
            console.log("SUCCESSFUL")
            // setTimeout(() => {
              navigate('/')
            // }, 300);
          }
          else {
            console.log(data.errors);
            data.errors ? dispatch({ type: 'error', payload: data.errors}) : dispatch({type: 'error', payload: [data.error]})

            setIsLoading(false)   //Remove loader component after message has been displayed
            // To scroll to the top (on smaller screens) after load is complete
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            })
          }
        })

  }

  const handleFileChange = (evt) => {
    const {value} = evt.target;
    console.log("Event", evt + "Value", value);
    
    // dispatch({type: 'profilePicture', fieldName:name, payload:files[0]})
  }
  

  return (
    <Layout>
      <Container fluid="md ">
          <Form className="mx-auto w-75 border rounded p-5 mt-5" onSubmit={handleSubmit} id="createProjectForm">
            <h1>Submit Project</h1>
       
              {/* To show error  */}
              {state.error.length > 0 ? 
                <Alert variant="danger" onClick={(evt) => dispatch({type: 'clearErrorAlert'})} style={{cursor: "pointer", fontWeight: "700"}} >
                  {state.error[0]}
                </Alert>
                : null
              }

            <Form.Group controlId="Form.ControlInput1">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                name="name"
                value={name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="Form.ControlTextarea1">
              <Form.Label>Project Abstract</Form.Label>
              <Form.Control
                as="textarea"
                rows={7}
                name="abstract"
                value={abstract}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="Form.ControlInput2">
              <Form.Label>Authors</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author names (separated by comma)"
                name="authors"
                value={authors}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="Form.ControlInput3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Use # to tag project with different topics (e.g. #javascript #mongodb)"
                name="tags"
                value={tags}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="row col-md-12">
              <Form.Group controlId="formFile" className="mb-3 col-md-12">
                <Form.Label>Upload Project File</Form.Label>
                <Form.Control type="file" name="projectFile" accept=".doc,.docx, application/msword, .pdf" onChange={handleFileChange}/>
              </Form.Group>
            </div>    

            <Button variant="success" type="submit">
              Submit
            </Button>

            {/* Loader Component */}
            {isLoading ? <Loader size={"100px"} /> : "" }

          </Form>
        </Container>
    </Layout>
  );
};

export default CreateProject;
