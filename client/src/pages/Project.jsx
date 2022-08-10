import React, { useState, useEffect, useRef, useReducer, useMemo } from "react";
import Layout from "./shared/Layout";
import { Container, Button, Modal, Navbar, Form } from "react-bootstrap";
import { ChevronDoubleUp, ChevronDoubleDown } from "react-bootstrap-icons";

import { useNavigate, useParams } from "react-router-dom";
import AuthService from '../services/auth';
// import JoditEditor from "jodit-react";

//Import reducer function to be used my useReducer hook
import { reducer } from "../reducers/project";
import Comment from "../components/comments/Comment";
import Loader from "../components/Loader";
import CommentForm from "../components/comments/CommentForm";
// import Editor from "../components/TextEditor/Editor";

// Importing the isUserProjectOwner method and getCurrentUser method
const { isUserProjectOwner, getCurrentUser } = AuthService;

const Project = () => {

  const editor = useRef(null);
  const [ content, setContent ] = useState('');

  // NB: set Display Button to true using onKey event as it is wrapped in memo function and fires once
  // const config = useMemo(() => ({
  //   readonly:false,
  //   placeholder: "Add a comment...",
  //   events: {
  //     keyup: ((e) =>  (
  //       setShowButtons(true) 
  //       // console.log("Event ",e) 
  //     )),
  //     // blur: () => alert("YEEE"),   //Blur and other events can also be handled
  //   }
  // }), [])

  const params = useParams();
  let navigate = useNavigate()

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
  const [commentTextArea, setCommentTextArea] = useState('');
  
  //Modal Code
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let projectId = params.id;

  useEffect(() => {
    console.log(`The id is: ${projectId}`);
    
    fetch(`/api/v1/project/${projectId}`)
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log('The Project Data: ', data);

        // If Project is invalid redirect to 404 error page
        if(data.status === "error") {
          navigate("*", true)
        } else {
          data = data.project;
          dispatch({type: 'loadProjectDetails', data:data})
          setProject(data)
          setComments(data.comments);
          getCurrentUser() !== null ? setUserId(getCurrentUser()._id) : setUserId('');
  
        }
     
      })

  }, [projectId, navigate]);

  console.log('The Project: ', project);

  // // Handle Comment change function
  // const handleCommentTextAreaChange = (evt) => {
  //   setShowButtons(true);
  //   setCommentTextArea(evt.target.value)
  // }

  // Handle Comment change function
  // const handleCommentChange = (newContent) => {
  //   // NB: Had some issues with setting display to true with onchange, so performed setDisplay to true using onKey event put in my config prop
  //   console.log("comment change ", newContent)
  //   setContent(newContent)

  // }

  // Handle Comments Change
  // const handleCancelComment = () => {
  //    //Clear input
  //   setContent('')
  //   setCommentTextArea('')
  //   setShowButtons(!showButtons)
    
  // }

  // console.log("cancelleed button state ", showButtons + " Content ", content)

  //Handle Comment function
  const handleCommentSubmit = (event) => {
    event.preventDefault();

    setIsLoading(true)

    const formData = {
      text:editor.current.value || commentTextArea,
      projectID:project._id
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
         //Clear input
         setContent('');
         setCommentTextArea('')
         setShowButtons(false);
         setIsLoading(false)
        // To scroll to the top (on smaller screens) after comment has been left
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })

      } else {
        alert("Failed to leave comment on project.")
        setIsLoading(false);
      }
    })
  }

  //Handle Comment function
  const commentSubmit = (text) => {

    setIsLoading(true)

    const formData = {
      text:text,
      projectID:project._id
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
        setIsLoading(false);
        
      } else {
        alert("Failed to leave comment on project.")
        setIsLoading(false);
        
      }
    })
    .catch((err) => {
      console.log(err)
      alert("Failed to leave comment on project. Check network connection")
      setIsLoading(false);
      
    })
  }

  const deleteComment = (commentId) => {

    console.log("Delete Comment from project");


    fetch(`/api/v1/project/${project._id}/delete/comment/${commentId}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"}
    }).then((res) => {
      return res.json()
    }).then((data) => {
      console.log("The Deleted Data", data)
      if(data.status === "OK" || data.status !== "error") {
        // Map through/Filter the Comments array and return an array where the deleted comment is not present
        const newComments = comments.filter((comm) => comm._id !== commentId);
    
        console.log("The result ater delete ", newComments);
        setComments(newComments)

      } else {
        alert("Failed to delete comment.");
      } 
    }).catch((err) => {
      console.log(err)
      alert("Failed to delete comment. Check network connection.");
    })
  }

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
let strippedString = content.replace(/(<([^>]+)>)|&nbsp;|&zwnj;/gi, "") || commentTextArea.trim();    

console.log("Stripped string value", strippedString);


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

                  {/* Import Comment Form */}
                  <CommentForm initialText={""} type="comment" placeholderText={"Leave a Comment ..."} labelButtonText="Comment" handleSubmit={commentSubmit} loadedState={isLoading} shouldShowButtons={false} /> 

                  {/* Load Comments */}
                  <div className="row">
                    <div className="comments">
                      {comments.map((comment) => (<Comment
                        project={project}
                        comment={comment} currentUser={userId} key={comment._id} deleteHandler={deleteComment}/>))}
                    </div>

                  </div>

                </div>
              </div>

            </div>


            {/* <div className="row mt-5">

              <div className="col-md-8" id="comments">
                <h4> Leave a Comment</h4>

                <Form onSubmit={handleCommentSubmit}>

                  {/* <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={newContent => setContent(newContent)} onChange={newContent => {}} /> */}

                  {/* <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onChange={handleCommentChange}/> */}

                  {/* <Form.Control as="textarea" rows={6} name="commentTextArea" className="mt-2" value={commentTextArea} onChange={handleCommentTextAreaChange} placeholder={"Leave a comment...."} /> */}

                  {/* {showButtons ? 
                    <div>
                      <Button variant="danger" type="button" className="mt-2" onClick={handleCancelComment}>
                        Cancel
                      </Button> */}
                      
                      {/* <Button variant="success" type="submit" className="mt-2 mx-2" disabled={strippedString < 1? true : false}> */}
                        {/* Submit */}
                        {/* Comment */}
                      {/* </Button> */}
                    {/* </div>  */}
                     {/* : null  */}
                  {/* } */}

                  {/* {isLoading ? <Loader size={"40px"} /> : "" } */}

                {/* </Form> */}

              {/* </div> */}
            {/* </div> */} 

          </section>
        </Container>
    </Layout>
  );
};
export default Project;