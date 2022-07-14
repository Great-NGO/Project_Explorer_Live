import React, { useMemo, useRef, useState } from 'react';
import parse from 'html-react-parser'; //Outputting html content
import { Button, Form } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import { HandThumbsUp, HandThumbsUpFill } from 'react-bootstrap-icons';
import { format, formatDistanceToNow} from 'date-fns'


const Comment = ({comment, currentUser, project}) => {

    // Jodit Config set up
    const editor = useRef(null);
    const [ content, setContent ] = useState('');
  
    const config = useMemo(() => ({
      readonly:false,
      placeholder: "Add a reply..."
    }), [])

    const [commentState, setCommentState ] = useState(comment);

    const [showReplies, setShowReplies ] = useState(false);
    const [openReplyForm, setOpenReplyForm] = useState(false);
    const [replyTextArea, setReplyTextArea] = useState('');

    // console.log("The comment from props", comment);
    // console.log("The project from props ", project);
    // console.log("The current user id from props ", currentUser);

      // Handle Reply change function
    const handleReplyChange = (newContent) => {
        console.log("reply change ", newContent)
        setContent(newContent)
    }
 
    // Handle Cancel Reply function
    const handleCancelReply = () => {
        setContent('')
        setOpenReplyForm(false)
    }

    const handleReplyTextAreaChange = (evt) => {  
        setReplyTextArea(evt.target.value)
    }
    
    const likeComment = async (evt) => {
        const action = "Like";
    
        const commentId = evt.target.dataset.commentId;
        // console.log(commentId)
        // try {
        //   //Return the saved commentLike object from our endpoint
        //   const commentLike = (await axios.post(`/comments/${commentId}/act`, { action, currentUser })).data.like
        //   console.log(commentLike);
     
        //   console.log('Liked comment', commentState);
        //   commentState.likes.push(commentLike)
        //   setCommentState({...commentState})
    
        // } catch (error) {
        //   console.log(error)
        // }
    
      }
    
      const dislikeComment = async (evt) => {
        const action = "Unlike";
        const commentId = evt.target.dataset.commentId;
    
        // try {
        //   //Return the saved commentLike object from our endpoint
        //   const commentDislike = (await axios.post(`/comments/${commentId}/act`, { action, currentUser })).data.like
        //   console.log('Dislike comment',commentDislike)
   
        //   // Similar to how we are checking on our backend, we receive the found like object from our api and pop/remove/pull it from our local state and it immediately renders.
        //   commentState.likes.pop(commentDislike)
        //   setCommentState({...commentState})
    
        // } catch (error) {
        //   console.log(error)
        // }
      }


    const handleCommentReplySubmit = async (evt) => {
        evt.preventDefault();
  
        // const formData = {
        //   text:html,
        //   commentId: commentState._id,
        //   currentUser: currentUser
        // }
        // console.log(formData);
  
        // //Reply Comments display without page reload
        // try {
        //     const replies = (await axios.post(`/project/${project._id}/comments/${comment._id}/replies/new`, formData)).data.check.replies
        //     console.log('replies data', replies);
  
        //     setReplies(replies);
        //     commentState.replies = replies;
        //     setCommentState({...commentState});
        //     setOpenReplyForm(false);
        //     setShowReplies(true);
  
        //   } catch(error) {
        //   console.log(error);
        // }
  
      }

    let strippedString = content.replace(/(<([^>]+)>)|&nbsp;|&zwnj;/gi, "") || replyTextArea.trim();    


    return (
        <div className="mb-2" key={commentState._id}>

            <div className="Comment Author">
                <strong> {commentState.commentAuthor ? `${commentState.commentAuthor.firstname} ${commentState.commentAuthor.lastname}` : 'Guest'} </strong>
            </div>
            
            <div className="CommentText">
                {parse(commentState.text)}
            </div>

            <div>

                {/* Reply Button which when clicked shows the reply Form */}
                {openReplyForm ?
                    <Form onSubmit={handleCommentReplySubmit} >
        
                    {/* <DefaultEditor name="text" value={html} onChange={onChange} required/> */}

                    <JoditEditor ref={editor} value={content} config={config}  onChange={handleReplyChange} />

                    {/* <Form.Control as="textarea" rows={6} name="replyTextArea" className="mt-2" value={replyTextArea} onChange={handleReplyTextAreaChange} placeholder={"Leave a reply...."} /> */}

                    <div className="form-group mt-2">
                        <Button variant="danger" className="me-2" type="button" onClick={handleCancelReply}> Cancel </Button>
                        <Button className="small" variant="success" type="submit" data-comment-id={commentState._id} disabled={strippedString < 1 ? true : false}> Reply </Button>
                    </div>
                    </Form>
                    :

                    // <span>Reply</span>
                    // <a href="">Reply</a>
                    <input className="me-2" type="button" onClick={() => setOpenReplyForm(true)} value="Reply" />
        
                }

                
                {/* ALL LOGGED IN USERS CAN LIKE COMMENTS */}
                {currentUser ?
                    <>
                        {commentState.likes.findIndex(like => like.likerId === currentUser) >= 0 ?
                        <span><button onClick={dislikeComment} data-comment-id={commentState._id} >Unlike <span> <HandThumbsUpFill color="blue" className="mb-1" /> </span> </button> </span> :
                        <button onClick={likeComment} data-comment-id={commentState._id} >Like <span> <HandThumbsUp className="mb-1" /> </span> </button>
                        }
                        &emsp;
                    </>
                    : ""
                }

                {/* Number of likes can be seen by any one */}
                <span id={`likes-count-${commentState._id}`} className="ml-1">{comment.likes.length} likes</span>
                &emsp;


                <span>
                {/* {(new Date()).toLocaleDateString('en-US', comment.createdAt)} */}
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, includeSeconds:true})}
                {/* {moment(commentState.createdAt).fromNow()} &nbsp; */}
                </span>
  
            </div>

        </div>
    );
};


export default Comment;