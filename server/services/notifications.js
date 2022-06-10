const Notification = require("../models/notification");
const { translateError } = require("./mongo_helper");

const createNewNotification = async ({
  notificationOwner,
  notificationMaker,
  actionType,
  projectId,
  commentId,
}) => {
  try {
    const newNotification = new Notification({
      notificationOwner,
      notificationMaker,
      actionType,
      projectId,
      commentId,
    });

    if (await newNotification.save()) {
      return [true, newNotification];
    }

    // return newNotification
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

const getUserNotification = async (userId) => {
  try {
    // We find a specific users notification and we populate the necessary fields and we return in descending order.. so users can see their latest notification.
    const notifications = await Notification.find({ notificationOwner: userId })
      .populate([
        {
          path: "notificationOwner",
          select: "_id firstname lastname email profilePicture",
        },
        {
          path: "notificationMaker",
          select: "_id firstname lastname email profilePicture",
        },
        {
          path: "commentId",
          populate: {
            path: "commentAuthor",
            select: "_id firstname lastname email profilePicture",
          },
        },
        {
          path: "projectId",
          populate: {
            path: "createdBy",
            select: "_id firstname lastname email profilePicture",
          },
        },
      ])
      .sort({ _id: -1 });
    if (notifications !== null) {
      return [true, notifications];
    } else {
      return [false, "No notification found for that particular user."];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

const deleteNotificationsByProjectID = async (projID) => {
  try {
    //We find all notifications by the particular project
    // const notifications = await Notification.find({projectId: projID})
    const notifications = await Notification.deleteMany({ projectId: projID });
    if (notifications !== null) {
      return [true, notifications];
    } else {
      return [false, "No notifications found for Project"];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

const getAllNotification = async () => {
  try {
    const allNotifications = await Notification.find().populate([
      { path: "notificationOwner" },
      { path: "notificationMaker" },
    ]);
    return allNotifications;
  } catch (error) {
    console.log(error);
    return translateError(error);
  }
};

/*To delete a notification once its clicked */
const deleteNotification = async (id) => {
    try {
        const deletedNotification = await Notification.findByIdAndDelete(id);
        if(deletedNotification !== null) {
            return [true, deletedNotification]
        } else {
            return [false, "Notification does not exist. It has been seen/deleted. "]
        }

    } catch (error) {
        return [false, translateError(error)];
    }
}


module.exports = {
  createNewNotification,
  getUserNotification,
  getAllNotification,
  deleteNotification,
  deleteNotificationsByProjectID,
};
