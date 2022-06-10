/* COMMENTING FEATURE SERVICES - create, edit/update, findby id, delete, get all etc. */
const Comment = require("../models/comment");
const CommentLikes = require("../models/commentLikes");
const CommentReplies = require("../models/commentReplies");
const { translateError } = require("./mongo_helper");


/* COMMENT METHODS/SERVICES */
/* Saving a new comment/ Creating a new Comment document */
const createComment = async ({ commentAuthor, projectID, text }) => {
  try {
    const comment = new Comment({
      commentAuthor,
      projectID,
      text,
    });

    if (await comment.save()) {
      return [true, comment];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Update Comment*/
const updateComment = async (id, field) => {
  try {
    const comment = await Comment.findByIdAndUpdate(id, field, { new: true }).populate([
      {
        path: "replies",
        populate: [
          {
            path: "replyAuthor",
            select: "_id firstname lastname email profilePicture",
          }
        ],
      }])
    if (comment !== null) {
      return [true, comment];
    } else {
      return [
        false,
        "Comment doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

/* Return comment with specified id */
const getCommentById = async (id) => {
  try {
    const comment = await Comment.findById(id).populate([
      {
        path: "replies",
        populate: [
          {
            path: "replyAuthor",
            select: "_id firstname lastname email profilePicture",
          },
        ],
      },
    ]);
    if (comment !== null) {
      return [true, comment];
    } else {
      return [false, "Comment doesn't exist. It is null and/or has been deleted."];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Delete Comment*/
const deleteComment = async (id) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if(deletedComment) {
      // Would have to delete things like replies, likes and notifications under a particular comment.
      return [true, deletedComment];
    } else {
      return [false, "Comment doesn't exist. It is null and/or has been deleted."];
    }

  } catch (error) {
    return [false, translateError(error)];
  }
}


/* REPLY METHODS/SERVICES */
/* Saving a new Reply/ Creating a new Reply document */
const createNewReply = async ({ replyAuthor, commentID, text }) => {
  try {
    const reply = new CommentReplies({
      replyAuthor,
      commentID,
      text
    })

    if (await reply.save()) {
      return [true, reply];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
}

/* Get reply by id*/
const getReplyById = async (id) => {
  try {
    const commentReply = await CommentReplies.findById(id).populate( {path: "replyAuthor", select: "_id firstname lastname email profilePicture"})
    if(commentReply !== null) {
      return [true, commentReply]
    } else {
      return [false, "Reply doesn't exist. It is null and/or has been deleted."];
    }
  } catch (error) {
    console.log(error)
    return translateError(error)
  }

};

/* Update Reply*/
const updateReply = async (id, field) => {
  try {
    const commentReply = await CommentReplies.findByIdAndUpdate(id, field, { new: true });
    if (commentReply !== null) {
      return [true, commentReply];
    } else {
      return [
        false,
        "Reply doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
}

/* Delete Reply*/
const deleteReply = async (id) => {
  try {
    const deletedReply = await CommentReplies.findByIdAndDelete(id);
    if(deletedReply) {
      return [true, deletedReply];
    } else {
      return [false, "Reply doesn't exist. It is null and/or has been deleted."];
    }

  } catch (error) {
    return [false, translateError(error)];
  }
}



/* LIKING FEATURE METHODS/SERVICES */
/* Saving a new like/ Creating a new Like document */
const createNewLike = async({ likerId, commentId}) => {
  try {
    const like = new CommentLikes({
      likerId,
      commentId
    })

    if(await like.save()){
      return like;
    }

  } catch (error) {
    console.log(error);
    return [false, translateError(error)]
  }
}

/* Find Comment Likes by liker id and comment id*/
const findLikesByUserIdAndCommentId = async ({currentUser, commentId}) => {
  try {

      const foundLike = await CommentLikes.findOne({ likerId: currentUser, commentId });
      if(foundLike !== null) {
        return [true, foundLike]
      } else {
        return [false, "Like does not exist"]
      }
  } catch (error) {
      return [false, translateError(error)]
  }
 
}

/* Delete Comment Likes*/
const deleteLikes = async (id) => await CommentLikes.findByIdAndDelete(id);
// await CommentLikes.deleteOne({ _id: likes._id })


module.exports = {
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
  createNewReply,
  getReplyById,
  updateReply,
  deleteReply,
  createNewLike,
  findLikesByUserIdAndCommentId,
  deleteLikes
};
