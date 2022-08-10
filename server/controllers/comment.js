const express = require('express');
const router = express.Router();
const { checkUser, authorize } = require("../middleware/auth");
const { createComment, getCommentById, updateComment, deleteComment, createNewLike, deleteLikes, findLikesByUserIdAndCommentId, createNewReply, updateReply, deleteReply, getReplyById } = require('../services/comment');
const { createNewNotification, deleteNotification } = require('../services/notifications');
const { getProjectById, updateProject } = require('../services/project');
const { getUserById } = require('../services/user');
const { createProjectValidator, validate, createReplyValidator, createCommentValidator } = require('../validator/index');

// CREATE A COMMENT
router.post('/project/new/comment', checkUser, createCommentValidator, async (req, res) => {
    const user = req.user;
    console.log("THE REQUEST BODY: ", req.body);

    let { text, projectID } = req.body;
    
    // To get the current user who created the comment - either guest/user
    let currentUser;
    user === undefined ? currentUser = user : currentUser = user.user_id
    console.log("The Current user ", currentUser);

    let project = await getProjectById(projectID);
    
    if(project[0] !== false) {
        project = project[1];

        // Create a new comment... We use the createComment from our Comments Services method which returns an array of true/false and the created comment
        const comment = await createComment({ commentAuthor:currentUser, projectID, text })
        console.log("Comment ", comment);

        if(comment[0] !== false) {
            project.comments = project.comments.unshift(comment[1]._id)
            // Destructure variables from project
            let {name, abstract, authors, tags, createdBy, comments} = project;
            let fields = { name, abstract, authors, tags, createdBy, comments }
            
            let updatedProjectWithComment = await updateProject(projectID, fields);
            console.log("Updated Project with comment", updatedProjectWithComment)
    
            // Sending notifications to project owner when a comment is made on his project using the createNotification method from our notifications services
            let notificationOwner = project.createdBy._id;
            let actionType = 'Comment';
            let projectId = project._id;
            let commentId = undefined;
            let notificationMaker = currentUser;

            const newNotification = await createNewNotification({ notificationOwner, notificationMaker, actionType, projectId, commentId })
            console.log('New Notification for Comment >> ', newNotification);
        
            if (updatedProjectWithComment[0] !== false) {
                console.log("Comments saved and added to projects successfully");
                res.status(200).json({ status: "ok", data: updatedProjectWithComment[1] });
            } else {
                return res.status(400).json({error:updatedProjectWithComment[1], status:"error"})
            }
        } else {
            return res.status(400).json({error: comment[1], status: "error"})
        }

    } else {
        return res.status(422).json({error: project[1], status: "error"})
    }

})

// EDIT A COMMENT
router.put('/project/:id/edit/comment/:commentId', checkUser, authorize, async (req, res) => {
    const projectID = req.params.id;
    const commentId = req.params.commentId;
    console.log('><Edit comment', req.body);
    const { text } = req.body;

    // let comment = await getCommentById(commentId);
    // if (comment[0] !== false) {
        // comment = comment[1]
        // let commentAuthor = comment.commentAuthor
        // comment.text = text;     //Might come back to do a check that allows only commentAuthors to edit comment
        let field = { text }
        let updatedComment = await updateComment(commentId, field);
        console.log('>>>uComm', updatedComment)
        if(updatedComment[0] !== false) {
            // To check that the project which holds the comment isn't deleted
            let check = await getProjectById(projectID);
            console.log('UPROJ>> ', check);
        
            if (check[0] !== false) {
                console.log("Comments updated successfully");
                res.status(200).json({ status: "ok", data: check[1], updatedComment:updatedComment[1] });
            } else {
                // If invalid project id or project has been deleted
                return res.status(422).json({error: "Project with comment not found. Failed to edit comment.", actualError: check[1], status:"error"})
            }
        } else {
            return res.status(400).json({error: updatedComment[1], status:"error"})
        }
    // } else {
    //     return res.status(422).json({error: comment[1], status:"error"})
    // }

})

// Delete Comment
router.delete('/project/:id/delete/comment/:commentId', checkUser, authorize, async (req, res) => {
    const id = req.params.id;
    const commentId = req.params.commentId;

    let project = await getProjectById(id);

    if(project[0] !== false) {

        const deletedComment = await deleteComment(commentId);
        if (deletedComment[0] !== false) {
            console.log("COMMENT DELETED SUCCESSFULLY");
            project = project[1]
            console.log(`Project before comment id was removed `, project)
            project.comments = project.comments.pull(commentId);
            await updateProject(id, project);
            console.log(`Project after comment was removed`, project);
            res.status(200).json({message: "Comment removed successfully.", status:"OK", deletedComment:deletedComment[1]})
            
        } else {
            console.log("FAILED TO DELETE COMMENT")
            return res.status(400).json({error: deletedComment[1], status:"error" })
        }
    } else {
        return res.status(422).json({error:"Project with comment not found. Failed to delete comment.", actualError:project[1], status:"error" })
    }

})


/* REPLYING FEATURE */
// CREATE A REPLY
router.post('/project/comment/new/reply', checkUser, createReplyValidator, async (req, res) => {
    const user = req.user;
    console.log("THE REQUEST BODY: ", req.body);

    let { text, projectID, commentID } = req.body;
    
    // To get the current user who created the reply - either guest/user
    let currentUser;
    user === undefined ? currentUser = user : currentUser = user.user_id
    console.log("The Current user ", currentUser);

    let comment = await getCommentById(commentID);
    
    if(comment[0] !== false) {
        comment = comment[1];
        // Create a new reply... We use the createNewReply from our Comments Services method which returns an array of true/false and the created reply
        const reply = await createNewReply({ replyAuthor:currentUser, commentID, text })
        console.log("Reply ", reply);

        if(reply[0] !== false) {
            comment.replies = comment.replies.unshift(reply[1]._id)
            // Destructure variables from project
            let fields = { replies:comment.replies }
            
            let updatedCommentWithReply = await updateComment(commentID, fields);
            console.log("Updated Comment with reply", updatedCommentWithReply)

           /* SENDING NOTIFICATIONS(CREATING A NEW NOTIFICATION DOCUMENT FOR BOTH PROJECT OWNER AND COMMENT AUTHOR) when a reply is made */
            let project = await getProjectById(projectID);
            if(project[0] !== true || project[0]==true&&project[1].createdBy===null) {
                return res.status(400).json({error:"Failed to send notification to project owner because project/project owner does not exist", status:"error"})
            } 
            else {
                project = project[1]
                
                let notificationOwner1 = project.createdBy._id;     //For Project owner
                let notificationOwner2 = comment.commentAuthor && comment.commentAuthor._id;    //For Comment Author

                let actionType = 'Reply';
                let projectId = project._id;
                let commentId = commentID;

                // we create a new notification document for Project Owner
                const newNotification1 = await createNewNotification({ notificationOwner:notificationOwner1, notificationMaker:currentUser, actionType, projectId, commentId })
                console.log("<<Project Owner New Notification for Reply ", newNotification1);
                // we create a new notification document for Comment Author if comment Author is not a guest
                if(notificationOwner2 !== undefined) {
                    const newNotification2 = await createNewNotification({ notificationOwner:notificationOwner2, notificationMaker:currentUser, actionType, projectId, commentId }) 
                    console.log("<<Comment Author New Notification for Reply ", newNotification2);    
                }

                if (updatedCommentWithReply[0] !== false) {
                    console.log("Replies saved and added to comment successfully");
                    res.status(200).json({ status: "ok", data: updatedCommentWithReply[1] });
                } else {
                    return res.status(400).json({error:updatedCommentWithReply[1], status:"error"})
                }
            }
        } else {
            return res.status(400).json({error: comment[1], status: "error"})
        }

    } else {
        return res.status(422).json({error: comment[1], status: "error"})
    }

})

// EDIT A REPLY
// router.put('/project/:projectId/comment/:commentId/edit/reply/:id', checkUser, authorize, async (req, res) => {
router.put('/comment/:commentId/edit/reply/:id', checkUser, authorize, async (req, res) => {
    // const projectID = req.params.projectId;
    const commentId = req.params.commentId;
    const replyId = req.params.id

    console.log('><Edit comment', req.body);
    const { text } = req.body;

    // let reply = await getReplyById(replyId);
    // if (reply[0] !== false) {
        // reply = reply[1]
        // let replyAuthor = reply.replyAuthor
        // reply.text = text;     //Might come back to do a check that allows only replyAuthors to edit replies
        let field = { text }
        let updatedReply = await updateReply(replyId, field);
        console.log('>>>uReply', updatedReply)
        if(updatedReply[0] !== false) {
            // To check that the comment which holds the reply isn't deleted
            let check = await getCommentById(commentId);
            console.log('UCOMM>> ', check);
        
            if (check[0] !== false) {
                console.log("Reply updated successfully");
                res.status(200).json({ status: "OK", data: check[1], updatedReply:updatedReply[1] });
            } else {
                // If invalid comment id or comment has been deleted
                return res.status(422).json({error: "Comment with reply not found. Failed to edit reply", actualError: check[1], status:"error"})
            }
        } else {
            return res.status(400).json({error: updatedReply[1], status:"error"})
        }
    // } else {
    //     return res.status(422).json({error: comment[1], status:"error"})
    // }

})

// DELETE A REPLY
router.delete('/comment/:commentId/delete/reply/:id', checkUser, authorize, async (req, res) => {
    const replyId = req.params.id;
    const commentId = req.params.commentId;

    let comment = await getCommentById(commentId);

    if(comment[0] !== false) {

        const deletedReply = await deleteReply(replyId);
        if (deletedReply[0] !== false) {
            console.log("REPLY DELETED SUCCESSFULLY");
            comment = comment[1]
            console.log(`Comment before reply id was removed `, comment)
            comment.replies = comment.replies.pull(replyId);
            await updateComment(commentId, comment);
            console.log(`Comment after reply was removed`, comment);
            res.status(200).json({message: "Reply removed successfully.", status:"OK", deletedReply:deletedReply[1]})
            
        } else {
            console.log("FAILED TO DELETE REPLY")
            return res.status(400).json({error: deletedReply[1], status:"error" })
        }
    } else {
        return res.status(422).json({error:"Comment with reply not found. Failed to delete reply.", actualError:comment[1], status:"error" })
    }

})

/* LIKING FEATURE */
// Like Unlike comments
router.post('/comment/like', authorize, async (req, res) => {
    let currentUser = req.user.user_id;
    let { action, commentId } = req.body;
    let comment = await getCommentById(commentId);

    if(comment[0] !== false) {
        comment = comment[1];
        //Check if the project is liked, create a new like document, save it, push the id to the comment likes array and update the comment successfully.
        if (action === 'like') {
            /* LIKE COMMENT*/
            const isLiked = await findLikesByUserIdAndCommentId({currentUser, commentId})
            console.log(`IS LIKED: `, isLiked);

            if (isLiked[0] !== false) {
                console.log("User has already liked comment before");
                return res.status(400).json({ error: "User has already liked comment before", status:"error" })
            }
            else {

                let likerId = currentUser;
                //WE USE THE createNewLike method which simply saves a new like document to our CommentLikes collection
                const like = await createNewLike({ likerId, commentId});
                console.log('Like using create service method ', like);

                comment.likes = comment.likes.push(like._id);
                console.log("Like added successfully");
                console.log(comment)
                await updateComment(commentId, comment);
            
                // Sending notifications to commentAuthor when a comment is liked      
                // Function Parameters for our createNewNotification method
                let notificationOwner = comment.commentAuthor && comment.commentAuthor._id;
                let actionType = 'Like';
                let projectId = comment.projectID;
                let notificationMaker = currentUser;
                console.log("notification owner", notificationOwner);
                //WE USE OUR createNewNotification method
                if(notificationOwner !== undefined) {   //Only create notification when there is a notification owner (A Comment author)
                    const newNotification = await createNewNotification({ notificationOwner, notificationMaker, actionType, projectId, commentId })
                    console.log("<<New Notification for Like >", newNotification);
                }

                res.status(200).json({ status: "OK", like, message:"Like comment successful" });
            }
        }
        else {
            /* UNLIKE COMMENT*/
            let like = await findLikesByUserIdAndCommentId({currentUser, commentId})
            console.log("The like from remove like", like);

            if(like[0] !== false) {
                like = like[1]
                comment.likes = comment.likes.pull(like._id);
                // console.log(comment);
                await deleteLikes(like._id);    //Always delete the like document with the specified id from the like collection before updating to prevent conflict
                let check = await updateComment(commentId, comment);
                console.log(check)
                res.status(200).json({ status: "OK", unlike:like, message:"Unlike comment successful" });    
            } else {
                return res.status(400).json({error: "User has already unliked comment before", status: "error"})
            }
   
        }
    } else {
        return res.status(422).json({error: comment[1], status: "error"})
    }

})

// Like Unlike replies
router.post('/reply/like', authorize, async (req, res) => {
    let currentUser = req.user.user_id;
    let { action, replyId } = req.body;
    let reply = await getReplyById(replyId);

    if(reply[0] !== false) {
        reply = reply[1];
        //Check if the reply is liked, create a new like document, save it, push the id to the reply likes array and update the comment successfully.
        if (action === 'like') {
            /* LIKE REPLY*/
            const isLiked = await findLikesByUserIdAndCommentId({currentUser, commentId:replyId})
            console.log(`IS LIKED: `, isLiked);

            if (isLiked[0] !== false) {
                console.log("User has already liked reply before");
                return res.status(400).json({ error: "User has already liked reply before", status:"error" })
            }
            else {

                let likerId = currentUser;
                //WE USE THE createNewLike method which simply saves a new like document to our CommentLikes collection
                const like = await createNewLike({ likerId, commentId:replyId});
                console.log('Like using create service method ', like);

                reply.likes = reply.likes.push(like._id);
                console.log("Like added successfully");
                console.log(reply)
                await updateReply(replyId, reply);

                res.status(200).json({ status: "OK", like, message:"Like reply successful" });
            }
        }
        else {
            /* UNLIKE REPLY*/
            let like = await findLikesByUserIdAndCommentId({currentUser, commentId:replyId})
            console.log("The like from remove like", like);

            if(like[0] !== false) {
                like = like[1]
                reply.likes = reply.likes.pull(like._id);
                // console.log(reply);
                await deleteLikes(like._id);    //Always delete the like document with the specified id from the like collection before updating to prevent conflict
                let check = await updateReply(replyId, reply);
                console.log(check)
                res.status(200).json({ status: "OK", unlike:like, message:"Unlike reply successful" });    
            } else {
                return res.status(400).json({error: "User has already unliked reply before", status: "error"})
            }
   
        }
    } else {
        return res.status(422).json({error: reply[1], status: "error"})
    }

})


/* GETTING NOTIFICATIONS LINK   */
//Deleting notifications once they are clicked
// router.delete('/notifications/delete/:id', async (req, res) => {
router.post('/notifications/delete/:id', async (req, res) => {
  
    console.log('Delete route was hit from Post request');
    const notificationId = req.params.id;
    let deletedNotification = await deleteNotification(notificationId);
    console.log('delete check ', deletedNotification)
    if(deletedNotification[0] !== false) {
        res.status(200).json({ status: "OK", notification:deletedNotification[1] });
    } else {
        return res.status(422).json({error:"Failed to open notification", actualError:deletedNotification[1], status:"error"})
    }

})

module.exports = router