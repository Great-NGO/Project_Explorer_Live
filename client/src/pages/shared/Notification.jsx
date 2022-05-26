import React, {useState} from "react";
import axios from 'axios';
import { Toast } from "react-bootstrap";


const Notification = ({notification, viewNotification}) => {

    let notificationTextStyle= {
        cursor: "pointer",
        color: "black"
    };

    console.log("NOTIFICATION AS PROPS", notification)

    const handleClick = (evt) =>{
        console.log('Notification Clicked');
        viewNotification(notification._id, notification.projectId._id);
    }
    

    return(
        <Toast.Body className="me-2" style={{backgroundColor: "dark"}}> 
              
        {/* IF THE NOTIFICATION ACTION TYPE IS COMMENT */}
            {notification.actionType === "Comment" ?
                <>
                    {/* IF notification maker is the owner of the notification. Then the user commented on his/her own project */}
                    {notification.notificationMaker && (notification.notificationOwner._id === notification.notificationMaker._id)? 
                        <div>
                            <span style={notificationTextStyle} onClick={handleClick}> You left a comment on your project </span>
                            <small> {`${new Date(notification.createdAt).toDateString()}`} </small>
                        </div>
                        : 
                    /* Another user who isn't the Project owner left a comment. The user is either a guest or a verified user */
                    <div>
                        <span style={notificationTextStyle}  onClick={handleClick}> {notification.notificationMaker? `${notification.notificationMaker.firstname} ${notification.notificationMaker.lastname} left a comment on your project` : `A Guest left a comment on your project`} </span>
                        <small> {`${new Date(notification.createdAt).toDateString()}`} </small>
                    </div>
                            
                    }
        
                </>                      
                
            : ('')
            }
         
         {/* IF NOTIFICATION ACTION TYPE IS A REPLY */}
            {notification.actionType === "Reply" ? 
              <>
                
                {/* FOR NOW WHEN A PROJECT OWNER MAKES A REPLY TO HIS OWN COMMENT OR HAS A REPLY TO HIS OWN COMMENT HE WILL HAVE TWO NOTIFICATIONS.. Cos the notification schema saves it twice for two different roles */}

                {/* Checks if the commentAuthor is the owner of the notification. i.e For Author of a comment */}
                {notification.commentId.commentAuthor&&(notification.commentId.commentAuthor._id === notification.notificationOwner._id)? 
                  <>
                    {/* Checks if the notification owner Id is the same as the notification maker. i.e. If the comment Author made the comment */}
                    {notification.notificationMaker&&(notification.notificationOwner._id === notification.notificationMaker._id)? 
                        <div>
                            <span style={notificationTextStyle} onClick={handleClick} > You replied to your comment  </span>     
                            <small> {`${new Date(notification.createdAt).toDateString()}`} </small>
                        </div>
                        : 
                        // <> Else condition - Someone (A guest or a logged in user) who is not the comment Author replied to the comments Author comment </>
                        <div>
                            <span style={notificationTextStyle} onClick={handleClick} > {notification.notificationMaker? `${notification.notificationMaker.firstname} ${notification.notificationMaker.lastname} replied to your comment` : `A Guest replied to your comment`} </span> 
                            <small> {`${new Date(notification.createdAt).toDateString()}`} </small>
                        </div>
                    }
                    
                  </>
                : 
                // The Project owner is the owner of the notification. He gets the notification that someone(a guest user or logged in user) made a reply to a comment on his project
                    (
                        <div>
                            <span style={notificationTextStyle} onClick={handleClick}> {notification.notificationMaker? `${notification.notificationMaker.firstname} ${notification.notificationMaker.lastname} replied to a comment on your project` : `A Guest replied to a comment on your project`} </span>
                            <small> {`${new Date(notification.createdAt).toDateString()}`} </small>
                        </div>
                    ) 
                }
              </>
              :('')
            }
       
            {/* IF NOTIFICATION ACTION TYPE IS A LIKE */}
            {notification.actionType === "Like" ?
              <>
                {/* Checks to see if the notification owner is the same as the notification maker. i.e If notificationOwner/comment Author liked his comment. */}
                {notification.notificationOwner._id === notification.notificationMaker._id? 
                    <div>
                        <span style={notificationTextStyle} onClick={handleClick}> You liked your comment </span>
                        <small> {`${new Date(notification.createdAt).toDateString()}`} </small>
                    </div>
                        : 
                    // Someone else - A verified user(Not a Guest) liked the comment Authors comment
                    <div>
                        <span style={notificationTextStyle} onClick={handleClick}> {`${notification.notificationMaker.firstname} ${notification.notificationMaker.lastname} liked your comment`}  </span>
                        <small> {`${new Date(notification.createdAt).toDateString()}`} </small>
        
                    </div>
                
                }
              </>
             
              : ('')
            }
       
            </Toast.Body>
    )
 
}


export default Notification;