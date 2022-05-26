import React, { useState, useEffect, useRef, useReducer } from "react";
import Layout from "./shared/Layout";
import { Container, Button, Modal, Navbar } from "react-bootstrap";
import { ChevronDoubleUp, ChevronDoubleDown } from "react-bootstrap-icons";

import { useParams } from "react-router-dom";
import AuthService from '../services/auth';
import JoditEditor from "jodit-react";
//Import reducer function to be used my useReducer hook
import { reducer } from "../reducers/project";

const Project = () => {

  const editor = useRef(null);
  const [ content, setContent ] = useState('');

  const config = {
    readonly: false
  }

  const params = useParams();
  
  // Importing the isUserProjectOwner method 
  const { isUserProjectOwner } = AuthService;


//Initial states (useReducer hook to handle Change and show initial values)
    let initialState = {
      projName: '',
      projAbstract: '',
      projAuthors: [],
      projTags: [],
      createdBy: '',
      profilePicture: '',
      createdById: '',
      createdAt: '',
      updatedAt: ''
      // comments: []
      // error: []
    }

  // const [project, setProject] = useState({});
  const [comments, setComments] = useState([]);
  const [sortStatus, setSortStatus ] = useState(true);

  
  //Modal Code
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  //Handle Comment function
  const handleCommentSubmit = (event) => {
    event.preventDefault();

    console.log('Typing')
  }

  let projectId = params.id;

  useEffect(() => {
    console.log(`The id is: ${projectId}`);
    
    fetch(`/api/project/${projectId}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log('The Project Data: ', data);
        data = data.project;

        dispatch({type: 'loadProjectDetails', data:data})
        setComments(data.comments);
    
      })
      .catch((err) => {
        console.log("Error is: ", err);
      });
  }, [projectId]);


//Invoking the useReducer hook and extracting input elements from our state
const [state, dispatch] = useReducer(reducer, initialState);
let { projName, projAbstract, projAuthors, projTags, createdBy, profilePicture, createdById, createdAt, updatedAt } = state;  


// Sorting Methods
const sortByDateOrLikes = (evt) => {
  const { value } = evt.target;

  if (value === "likes") {
    console.log("Sort by likes");
  }
  else if (value === "date") {

    console.log("Sort by datee")
  }
}

const sortAscending = (evt) => {
  console.log("Ascending")
  if (sortStatus) {
    setSortStatus(false)
  }
}

const sortDescending = (evt) => {
  console.log("Descending");

  if (sortStatus === false) {
    setSortStatus(!sortStatus)
  }

}


  return (
    <Layout>
        <Container fluid="md">
                  
          <nav className="container" id="headerNav">
            <div>
              <h1 id="project_name">{projName}</h1>
            </div>

            <Navbar collapseOnSelect expand="md" style={{backgroundColor: "lightgray"}}>
              <Container>
              <Navbar.Brand>
                <img src={profilePicture.includes('http')? profilePicture : `/${profilePicture}` } alt="" className="defaultProfilePic" style={{ borderRadius: '50%', width: '65px', height: '65px', }} />
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
                    { isUserProjectOwner(createdById) === true?  
                      <a className="btn btn-primary" href={`/editProject/${projectId}`} id="editBtn">
                        Edit Project 
                      </a>
                      : null
                    } 
                  </div>
                </div>
              </nav>

              </Navbar.Collapse>
              </Container>
            </Navbar>
           
          </nav>

          <section className="container">
            {/* This row shows Project Abstract, Project Details (Hidden in a modal which is activated by the click of a button) and Comments*/}
            <div className="row flex-md-row-reverse">

                {/* Would only show first at breakpoint because of flex-md-row-reverse class in the parent element*/}
              <div className="col-md-4 my-2" id="projDetCol" >

                <button type="button" className="btn btn-primary" onClick={handleShow}>
                  Show Project Details
                </button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title> <h3>Project Details</h3> </Modal.Title>
                  </Modal.Header>
                  
                  <Modal.Body>
                    <div className="card">
                      <div className="card-header">
                        <strong>Author(s)</strong>
                      </div>

                      <div className="card-block" id="project_authors">
                        {projAuthors&&projAuthors.map((authors, index) => (
                            <>
                            <p className='card-text' key={index}>{authors} </p> 
                            <hr></hr>
                          </>
                        ))}
                      </div>

                      <div className="card-footer" id="project_tags">
                        {projTags && projTags.map((tags, index) => {
                            return (
                            <small style={{ color: "dodgerblue", fontSize: "15px" }} key={index}> 
                                {tags} 
                              </small>
                      
                            );
                          })}
                        </div>
                      </div>
                  </Modal.Body>
                </Modal>
      
              </div>

              {/* Shows first till breakpoint */}
              <div className="col-md-8 my-2 projAbsCol" id="project_abstract">
                <h3>Project Abstract</h3>
                <hr></hr>
                <p>{projAbstract}</p>

                <div className="mt-4">
                  <span className="commentCount">{comments.length}</span> Comments
                  {/* <span className="commentCount">0</span> Comments */}
                  <div style={{ float: "right" }}>
                    <span className="sortByText">Sort By </span>
                    <span className="pe-1">
                      <select className="select" onChange={sortByDateOrLikes}>

                        <option value="date">Date</option>
                        <option value="likes">Likes</option>
                      </select>
                    </span>
                    {
                      <>
                        {/* The arrows are to sort by either ascending or descending order.. */}
                        {/* The arrows are shown conditionally based on sortStatus. */}
                        {sortStatus ?
                          <ChevronDoubleUp color="black" size={20} onClick={sortAscending} /> :
                          <ChevronDoubleDown color="black" size={20} onClick={sortDescending} />
                        }
                      </>
                    }
                  </div>
                  <hr></hr>

                  {/* <div className="row">
                    <div className="comments">
                      {comments.map((comment) => (<Comment
                        project={project}
                        comment={comment} currentUser={user ? user._id : ''} key={comment._id} />))}
                    </div>

                  </div> */}

                </div>
              </div>

            </div>


            <div className="row mt-5">

              <div className="col-md-8" id="comments">
                <h4> Leave a Comment</h4>

                <form onSubmit={handleCommentSubmit}>
            
                  {/* <DefaultEditor name="text" value={html} onChange={onChange} /> */}

                  <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={newContent => setContent(newContent)} onChange={newContent => {}}/>

                  <Button variant="primary" type="submit" className="mt-2">
                    Submit
                  </Button>
                </form>

              </div>
            </div>

          </section>
        </Container>
    </Layout>
  );
};
export default Project;