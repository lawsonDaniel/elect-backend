import { MediaModel, NotificationModel, UsersModel } from "../src/model";

export const uploadSingleMedia = async (
  user: any,
  mediaType: string,
  link: string,
) => {
  try {
    // Check if the user exists
    const userExists = await UsersModel.findOne({
      where: {
        id: user?.id,
      },
    });

    if (!userExists) {
      throw new Error(`User with id ${user?.id} does not exist`);
    }

    // Check if the user has uploaded that document, then update it if needed
    const existingMedia = await MediaModel.findOne({
      where: {
        userId: userExists.id,
        mediaType,
      },
    });

    if (existingMedia) {
      // If the media file already exists for the user and media type, update the link
      existingMedia.link = link;
      await existingMedia.save();
    } else {
      // If the media file doesn't exist, create a new one
      await MediaModel.create({
        link,
        mediaType,
        userId: userExists.id,
      });
    }

    // Provide feedback or return a success message if needed
    return {
      success: true,
      message: "File uploaded successfully",
    };
  } catch (err: any) {
    // Handle errors and return an appropriate response
    return {
      success: false,
      message: err.message || "An error occurred while uploading the file",
    };
  }
};

export const getSingleUploadedMedia = async (user: any, mediaType: string) => {
  // Check if the user exists
  const userExists = await UsersModel.findOne({
    where: {
      id: user?.id,
    },
  });

  if (!userExists) {
    throw new Error(`User with id ${user?.id} does not exist`);
  }

  // Check if the user has uploaded that document, then update it if needed
  const existingMedia = await MediaModel.findOne({
    where: {
      userId: userExists.id,
      mediaType,
    },
  });
  if (existingMedia) {
    return existingMedia?.link;
    console.log(existingMedia);
  } else {
    throw new Error("No such media found");
  }
};

export const sendPrivateMessage = (
  sender_id: string,
  receiver_id: string,
  message: string,
  file: any,
) => {};

type NotificationType = "NEW_MESSAGE" 
export const createNotification  = async(type:NotificationType,userId:string,senderId:string)=>{
try{
  //get nottifaction sender 
  const Sender = await UsersModel.findOne({
    where:{
      id:senderId
    }
  })
  if(!Sender){
    throw new Error('sender not found')
  }
  
  const notification = await NotificationModel.create({
    notificationType:type,
    userId:userId,
    notificationContent:`new message from ${Sender?.dataValues?.fullName}`
  })
  return notification
}catch(err:any){
  console.log(err,'eerrrrr')
  throw new Error(err)
}
}