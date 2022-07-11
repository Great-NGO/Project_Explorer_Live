import React, { useState, useEffect, useRef, useReducer, useMemo } from "react";
import Layout from "./shared/Layout";
import { Container, Button, Modal, Navbar } from "react-bootstrap";
import { ChevronDoubleUp, ChevronDoubleDown } from "react-bootstrap-icons";

import { useParams } from "react-router-dom";
import AuthService from '../services/auth';
import JoditEditor from "jodit-react";
// import { DefaultEditor } from 'react-simple-wysiwyg';

//Import reducer function to be used my useReducer hook
import { reducer } from "../reducers/project";
import Comment from "../components/comments/Comment";
import Loader from "../components/Loader";


// Importing the isUserProjectOwner method and getCurrentUser method
const { isUserProjectOwner, getCurrentUser } = AuthService;

const Project = ({placeholder}) => {

  const editor = useRef(null);
  const [ content, setContent ] = useState('');

  // const config = {
  //   readonly: false,
  //   // placeholder: "Leave a comment..."
  // }

  const config =  useMemo({
    readonly: false,
    placeholder: placeholder || "Leave a comment..."
  }, [placeholder])

  const params = useParams();

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

  const [project, setProject] = useState({});
  const [comments, setComments] = useState([]);
  //For sorting comments
  const [sortOrder, setSortOrder] = useState('')
  // To toggle between ascending or descending order
  const [sortStatus, setSortStatus ] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  // const [projectOwnerId, setProjectOwnerId] = useState(null);
  
  //Modal Code
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  // Handle Cancel Comment function
  const handleCommentChange = (evt) => {
    console.log("comment change")

    setShowButtons(true);
    setContent(evt.target.value)
  }

  // Handle Cancel Blur function
  const handleCommentBlur = (evt) => {
    console.log("comment change")
    setShowButtons(true);
  }

  // Handle Comments Change
  const handleCancelComment = () => {
     //Clear input
    editor.current.value=''
    setShowButtons(false)
  }

  //Handle Comment function
  const handleCommentSubmit = (event) => {
    event.preventDefault();

    setIsLoading(true)

    const formData = {
      text:editor.current.value,
      projectID:project._id
    }

    if(formData.text.trim().length < 2) {
      console.log("The original length of the comment minus white space is ", formData.text.trim().length);
      console.log("WRONG... No comment text seen")
      alert("Failed to leave comment on project because no comment was sent")

    }

    console.log("The comment ready to be sent", formData)

    fetch('/api/v1/project/new/comment', {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json"}
    }).then((res) => {
      console.log("The comment res", res)
      return res.json()
    }).then((data) => {
      console.log("The data ", data)
      if(data.status === "ok" || data.status !== "error") {
        const newComments = data.data.comments;
        console.log("The new comments ", newComments)
        setComments(newComments);
        // To scroll to the top (on smaller screens) after comment has been left
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
         //Clear input
         editor.current.value=''
         setIsLoading(false)

      } else {
        alert("Failed to leave comment on project.")
        setIsLoading(false);
      }
    })
  }

  let projectId = params.id;

  useEffect(() => {
    console.log(`The id is: ${projectId}`);
    
    fetch(`/api/v1/project/${projectId}`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log('The Project Data: ', data);
        data = data.project;

        dispatch({type: 'loadProjectDetails', data:data})
        setProject(data)
        // console.log('The Project Data: ', project);
        setComments(data.comments);
    
        getCurrentUser() !== null ? setUserId(getCurrentUser()._id) : setUserId('');

      })
      .catch((err) => {
        console.log("Error is: ", err);
      });
  }, [projectId]);

  console.log('The Project: ', project);


//Invoking the useReducer hook and extracting input elements from our state
const [state, dispatch] = useReducer(reducer, initialState);
let { projName, projAbstract, projAuthors, projTags, createdBy, profilePicture, createdById, createdAt, updatedAt } = state;  


// Sorting Methods
const sortByDateOrLikes = (evt) => {
  const { value } = evt.target;
  setSortOrder(value);      //This helps us with re-arranging the comments

  if (value === "likes") {
    console.log("Sort by likes");
    const sorted = comments.sort((a, b) => {
      return b.likes.length - a.likes.length;
    })
    console.log("Sorted by likes", sorted)
    setComments(sorted);
  }
  else if (value === "date") {
    // By default comments will be sorted by date in descending order
    console.log("Sort by datee")
    const sorted = comments.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    console.log("SOrted by date", sorted);
    setComments(sorted);
  }
}

const sortAscending = (evt) => {
  console.log("Ascending")
  if (sortStatus) {
    setSortStatus(false)
    let sorted = comments.reverse();
    console.log("Ascending sorted", sorted);
    setComments(sorted);
    setSortStatus(false);
  }
}

const sortDescending = (evt) => {
  console.log("Descending");

  if (sortStatus === false) {
    let sorted = comments.reverse();
    console.log("Descending sorted", sorted);
    setComments(sorted);
    setSortStatus(!sortStatus)
  }

}

console.log("Content ", content)
console.log("Editor Content", editor)

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
                    { isUserProjectOwner(createdById) === true?  
                      <a className="btn btn-success" href={`/editProject/${projectId}`} id="editBtn">
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

                <button type="button" className="btn btn-success" onClick={handleShow}>
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
                            <p className='card-text mx-3' key={index}>{authors} </p> 
                            <hr></hr>
                          </>
                        ))}
                      </div>

                      <div className="card-footer" id="project_tags">
                        {projTags && projTags.map((tags, index) => {
                            return (
                            <small style={{ color: "dodgerblue", fontSize: "15px" }} key={index}> 
                                #{tags} 
                              </small>
                      
                            );
                          })}
                        </div>

                        <div className="card mt-3">
                          <div className="card-header">
                            <strong>Project files</strong>
                          </div>

                          <div className="card-block" id="vpCardBlock">
                            <p className="card-text m-2">No file uploaded yet</p>
                          </div>
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
                      <select className="select" onChange={sortByDateOrLikes} >

                        <option value="date">Date</option>
                        <option value="likes">Likes</option>
                      </select>
                    </span>
                    {
                      <>
                        {/* The arrows are to sort by either ascending or descending order.. */}
                        {/* The arrows are shown conditionally based on sortStatus. */}
                        {sortStatus ?
                          <ChevronDoubleUp color="black" size={20} onClick={sortAscending} style={{cursor:"pointer"}} /> :
                          <ChevronDoubleDown color="black" size={20} onClick={sortDescending} style={{cursor:"pointer"}} />
                        }
                      </>
                    }
                  </div>
                  <hr></hr>

                  {/* Load Comments */}
                  <div className="row">
                    <div className="comments">
                      {comments.map((comment) => (<Comment
                        project={project}
                        comment={comment} currentUser={userId} key={comment._id} />))}
                    </div>

                  </div>

                </div>
              </div>

            </div>


            <div className="row mt-5">

              <div className="col-md-8" id="comments">
                <h4> Leave a Comment</h4>

                <form onSubmit={handleCommentSubmit}>

                  <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onChange={handleCommentChange} />
                  {/* <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={newContent => setContent(newContent)} onChange={newContent => {}} /> */}
                  {/* <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={newContent => setContent(newContent)} onChange={handleCommentChange} /> */}
                  {/* <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={handleCommentBlur} onChange={newContent => {}} /> */}
                    
                  {/* <DefaultEditor name="text" value={content} onChange={handleCommentChange} required/> */}

                  {showButtons ? 
                    <div>
                      <Button variant="danger" type="reset" className="mt-2" onClick={handleCancelComment}>
                        Cancel
                      </Button>
                      
                      <Button variant="success" type="submit" className="mt-2 mx-2" >
                        Submit
                      </Button>
                    </div> 
                     : null 
                  }

                

                  {isLoading ? <Loader size={"40px"} /> : "" }

                </form>

              </div>
            </div>

          </section>
        </Container>
    </Layout>
  );
};
export default Project;