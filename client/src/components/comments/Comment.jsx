// import React, { useMemo, useRef, useState } from 'react';
import React, { useState } from 'react';
import parse from 'html-react-parser'; //Outputting html content
// import { Button, Dropdown, Form, } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
// import JoditEditor from 'jodit-react';
import { HandThumbsUp, HandThumbsUpFill} from 'react-bootstrap-icons';
import { formatDistanceToNow} from 'date-fns'
import axios from 'axios';
import Loader from '../Loader';
import CustomToggle from '../CustomToggle';
import AuthService from '../../services/auth';
// import EditComment from './EditComment';
import CommentForm from './CommentForm';

 const { isUserProjectOwner } = AuthService;

const Comment = ({comment, currentUser, project, deleteHandler}) => {

    // Jodit Config set up
    // const editor = useRef(null);
    const [ replyContent, setReplyContent ] = useState('');
  
    // const config = useMemo(() => ({
    //   readonly:false,
    //   placeholder: "Add a reply..."
    // }), [])

    const [commentState, setCommentState ] = useState(comment);
    const [replies, setReplies] = useState(comment.replies)
    const [showReplies, setShowReplies ] = useState(false);
    const [openReplyForm, setOpenReplyForm] = useState(false);
    // const [replyTextArea, setReplyTextArea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // console.log("Comment state ", commentState)

    const [ showButtonOption, setShowButtonOption] = useState(true)


    isUserProjectOwner(project.createdBy._id)
    // console.log("Is user project owner ", isUserProjectOwner(project.createdBy._id))
    // console.log("The comment from props", comment);
    // console.log("The project from props ", project);
    // console.log("The current user id from props ", currentUser);

      // Handle Reply change function
    // const handleReplyChange = (newContent) => {
    //     console.log("reply change ", newContent)
    //     setReplyContent(newContent)
    // }
 
    // Handle Cancel Reply function
    // const handleCancelReply = () => {
    //     setReplyContent('')
    //     setOpenReplyForm(false)
    // }

    // const handleReplyTextAreaChange = (evt) => {  
    //     setReplyTextArea(evt.target.value)
    // }
    
    const likeComment = async (evt) => {
        const action = "like";
    
        // const commentId = evt.target.dataset.commentId;
        const commentId = commentState._id;

        try {
          //Return the saved commentLike object from our endpoint
          const commentLike = (await axios.post('/api/v1/comment/like', { action, commentId })).data.like
          console.log("The comment like", commentLike);
     
          console.log('Liked comment', commentState);
          commentState.likes.push(commentLike)
          setCommentState({...commentState})
    
        } catch (error) {
          console.log(error)
          console.log(error.response.data.error)
          alert("Failed to Like Comment");

        }
    
      }
    
      const dislikeComment = async (evt) => {
        const action = "Unlike";
        // const commentId = evt.target.dataset.commentId;
        const commentId = commentState._id;
        console.log("Comment state ", commentState)
        console.log("Comment state id ", commentState._id)
        console.log("The comment Id", commentId)

        try {
          //Return the saved commentLike object from our endpoint
          const commentDislike = (await axios.post('/api/v1/comment/like', { action, commentId })).data.unlike        //Self-Invoking function
          console.log('Dislike comment',commentDislike)
   
          // Similar to how we are checking on our backend, we receive the found like object from our api and pop/remove/pull it from our local state and it immediately renders.
          commentState.likes.pop(commentDislike)
          setCommentState({...commentState})
    
        } catch (error) {
          console.log(error)
          console.log(error.response.data.error)
          alert("Failed to unlike comment");

        }
      }


    // const handleCommentReplySubmit = async (evt) => {
    //     evt.preventDefault();

    //     setIsLoading(true)
  
    //     const formData = {
    //       text:editor.current.value,
    //       projectID: project._id,
    //       commentID: commentState._id,
          
    //     }
    //     console.log("The reply form data", formData);
  
    //     // //Reply Comments display without page reload
    //     fetch('/api/v1/project/comment/new/reply', {
    //       method:"POST",
    //       body: JSON.stringify(formData),
    //       headers: {"Content-Type": "application/json"}
    //     }).then((res) => {
    //       return res.json()
    //     }).then((data) => {
    //       console.log("The Data from reply submit", data)
    //       if(data.status !== "error" || data.status === "ok") {
    //           const newReplies = data.data.replies;
    //           console.log("The new replies data", newReplies);
    //           setReplies(newReplies)
    //           commentState.replies = newReplies;
    //           setCommentState({...commentState})

    //           //Clear Input, remove the form pop-up and show the new replies
    //           setReplyContent('')
    //           setOpenReplyForm(false)
    //           setShowReplies(true)
    //           setIsLoading(false)
    //       } else{
    //         alert("Failed to leave reply on comment");
    //         setIsLoading(false)
    //       }
    //     })

    //   }

      const replySubmit = async (text) => {

        setIsLoading(true)
  
        const formData = {
          text,
          projectID: project._id,
          commentID: commentState._id, 
        }

        console.log("The reply form data", formData);
  
        // //Reply Comments display without page reload
        fetch('/api/v1/project/comment/new/reply', {
          method:"POST",
          body: JSON.stringify(formData),
          headers: {"Content-Type": "application/json"}
        }).then((res) => {
          return res.json()
        }).then((data) => {
          console.log("The Data from reply submit", data)
          if(data.status !== "error" || data.status === "ok") {
              const newReplies = data.data.replies;
              console.log("The new replies data", newReplies);
              setReplies(newReplies)
              commentState.replies = newReplies;
              setCommentState({...commentState})

              //Clear Input, remove the form pop-up and show the new replies
              setReplyContent('')
              setOpenReplyForm(false)
              setShowReplies(true)
              setIsLoading(false)
          } else{
            alert("Failed to leave reply on comment");
            setIsLoading(false)
          }
        })

      }

      const handleEditComment = (text) => {
        // evt.preventDefault()

        console.log("The text --", text)

        // console.log("Edit comment", commentState);

        // setReplyContent(commentState.text)
        // setOpenReplyForm(true)
        // setReplyContent(commentState.text)

        
        fetch(`/api/v1/project/${project._id}/edit/comment/${commentState._id}`, {
          method: "PUT",
          body:JSON.stringify({text}),
          headers: {"Content-Type": "application/json"}
        }).then((res) => {
          return res.json()
        }).then((data) => {
          console.log("The Edited Data", data)
          if(data.status === "ok" || data.status !== "error") {
            const editedComments = data.data.comments;
            console.log("Edited comments ", editedComments);

            // setCommentState({...editedComments});
            // setCommentState({...editedComments, text});
            setCommentState({...commentState, text})
            setIsEditing(false);

          } else {
            alert("Failed to edit comment");
            setIsEditing(false);
          }
        })

      }

      const handleDeleteComment = (evt) => {

        console.log("Delete Comment");

        evt.preventDefault();

        deleteHandler(commentState._id)

      }

      const cancelHandler = () => {
        setIsEditing(false);
        setShowButtonOption(false)

      }

    // let strippedString = replyContent.replace(/(<([^>]+)>)|&nbsp;|&zwnj;/gi, "") || replyTextArea.trim();    

    return (
        <div className="mb-2" key={commentState._id}>

            <div>
              
                <span className="Comment Author">
                  <strong> {commentState.commentAuthor ? `${commentState.commentAuthor.firstname} ${commentState.commentAuthor.lastname}` : 'Guest'} </strong>
                  <span> <small> {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, includeSeconds:true})} </small> </span>
                </span>

                {/* EDIT/DELETE */}
                  <span>
                    <Dropdown variant="dark" className='div-inline'>
                      {/* If a comment has an author (not a guest) and the logged in user is the comment author (the id of the logged in user and the comment author id matches) and the user is not the project owner, then they can edit or delete */}
                      {commentState.commentAuthor && (currentUser === commentState.commentAuthor._id) && isUserProjectOwner(project.createdBy&&project.createdBy._id) !== true ?
                      <>
                          <Dropdown.Toggle as={CustomToggle} />
                            <Dropdown.Menu variant='dark'>
                              <Dropdown.Item onClick={() => setIsEditing(true)}>Edit</Dropdown.Item>
                              <Dropdown.Item onClick={handleDeleteComment}>Delete</Dropdown.Item> 
                            </Dropdown.Menu>
                                
                        </> : ""
                      }

                      {/* If the logged in user is the project owner */}
                      {isUserProjectOwner(project.createdBy&&project.createdBy._id) ? 
                        <>
                              <Dropdown.Toggle as={CustomToggle} />
                              <Dropdown.Menu variant='dark'>
                              {/* If the comment was created by the project owner, then the project owner can edit or delete that comment. Else if the comment was not created by the project owner, then the project owner can only delete the comment */}
                              {commentState.commentAuthor && (currentUser === commentState.commentAuthor._id)  ? 
                                <>
                                  <Dropdown.Item onClick={() => setIsEditing(true)}>Edit</Dropdown.Item>
                                  <Dropdown.Item onClick={handleDeleteComment}>Delete</Dropdown.Item> 
                                </> : <Dropdown.Item onClick={handleDeleteComment}>Delete</Dropdown.Item> 
                              } 
                              </Dropdown.Menu>
                            
                        </> : ""
                      }

                    </Dropdown>
                  </span>               
                
            </div>
            
            <div className="CommentText">
                {isEditing ? 
                    // <CommentForm initialText={commentState.text} type="editComment" labelButtonText="Update" handleSubmit={handleEditComment} cancelHandler={cancelHandler} placeholderText="Edit your comment ..." shouldShowButtons={true}/> : 
                    <CommentForm initialText={commentState.text} type="editComment" labelButtonText="Update" handleSubmit={handleEditComment} cancelHandler={cancelHandler} placeholderText="Edit your comment ..." shouldShowButtons={showButtonOption}/> : 
                    <div>
                      {parse(commentState.text)}
                    </div>
                }
            </div>

            <div>

                {/* Reply Button which when clicked shows the reply Form */}
                {openReplyForm ?
                 
                    <CommentForm initialText={""} type="reply" labelButtonText={"Reply"} handleSubmit={replySubmit} shouldShowButtons={true} placeholderText={"Add your reply here..."} />
                    // {isLoading ? <Loader size={"30px"} /> : "" }

                    :

                    <input className="me-2" type="button" onClick={() => setOpenReplyForm(true)} value="Reply" />
        
                }

                
                {/* ALL LOGGED IN USERS CAN LIKE COMMENTS */}
                {currentUser ?
                    <>
                        {commentState.likes.findIndex(like => like.likerId === currentUser) >= 0 ?
                        <HandThumbsUpFill color="red" size={28} className="mb-1" onClick={dislikeComment} style={{cursor:"pointer"}} /> :
                        <HandThumbsUp size={28} className="mb-1" onClick={likeComment} style={{cursor:"pointer"}} />

                        }
                        &emsp;
                    </>
                    : ""
                }

                {/* Number of likes can be seen by any one */}
                <span className="ml-1">{comment.likes.length} likes</span>
                &emsp;
  
            </div>

            <div>
                {/* Displaying Replies which is based on when a user wants to see replies .. Also added a hide reply button add*/}
                {showReplies ? 
                <>
                    <button type="button" style={{  border: 'none', padding: '0 !important', color: 'black', fontWeight: 'bolder', textDecoration: 'underline', cursor: 'pointer', marginTop: '5px' }} onClick={() => setShowReplies(false)}> --Hide {replies.length} replies</button>

                    {commentState.replies.map((reply) => (
                    // <Reply reply={reply} comment={commentState} currentUser={currentUser} project={project} key={reply._id} /> 
                    <p className="mb-2 mt-2 mx-5"> {reply.text}</p>
                    ))}
                </> : 
                <>
                    {replies.length < 1 ? ""
                    :  
                    <button type="button" style={{  border: 'none', padding: '0 !important', color: 'green', fontWeight: 'bolder', textDecoration: 'underline', cursor: 'pointer', marginTop: '5px' }} onClick={() => setShowReplies(true)} > View {replies.length} replies</button>
                    }
                </>
                }

            </div>
        </div>
    )
};


export default Comment;