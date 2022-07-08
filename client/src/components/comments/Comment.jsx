import React, { useState } from 'react';
import parse from 'html-react-parser'; //Outputting html content



const Comment = ({comment, currentUser, project}) => {

    const [commentState, setCommentState ] = useState(comment);

    // console.log("The comment from props", comment);
    // console.log("The project from props ", project);
    // console.log("The current user id from props ", currentUser);

    return (
        <div className="mb-2" key={commentState._id}>

            <div className="Comment Author">
                <strong> {commentState.commentAuthor ? `${commentState.commentAuthor.firstname} ${commentState.commentAuthor.lastname}` : 'Guest'} </strong>
            </div>
            
            <div className="CommentText">
                {parse(commentState.text)}
            </div>

        </div>
    );
};


export default Comment;