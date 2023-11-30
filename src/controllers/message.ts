import { Request, Response } from "express";
import { StaffMessageModel, UsersModel } from "../model";

export class MessageController {
    public staff = async (req: any, res: Response) => {
        const { message, recipient,userType } = req.body;
        if(userType === 'staff'){

        try {
            let users: any[];

            if (recipient === "all") {
                users = await UsersModel.findAll({
                    where: { userType: 'student' },
                });
            } else if (recipient === "staff") {
                users = await UsersModel.findAll({
                    where: { userType: 'staff' },
                });
            } else {
                users = await UsersModel.findAll({
                    where: { level: recipient },
                });
            }

            const senderId = req?.user?.id;

            if (users && users.length > 0) {
                // Use Promise.all to parallelize the creation of StaffMessageModel instances
                await Promise.all(users.map(async (user) => {
                    if (user.id !== senderId) {
                        await StaffMessageModel.create({
                            message,
                            senderId,
                            receiver: recipient,
                        });
                    }
                }));

                res.json({
                    status: true,
                    message: "Messages successfully sent to all users",
                });
            } else {
                res.json({
                    status: false,
                    message: "No user found",
                });
            }
        } catch (err:any) {
            // Handle any other errors that occurred
            res.status(500).json({
                status: false,
                message: "Internal server error",
                error: err.message,
            });
        }
        }else{
            res.json({
                status:false,
                message:"you need to be a staff to be able to send messages"
            })
        }
    };
    public getStaffMessage = async(req:any,res:Response)=>{
       //get the user info 
       const {userType,level} = req?.user
       const {firstname} = req?.user
       try{
        let message: any;
        if(userType === "staff"){
            message = await StaffMessageModel.findAll({
                where:{
                    receiver:userType
                }
            })
        }else{
            message = await StaffMessageModel.findAll({
                where:{
                    receiver:level
                }
            })
        }
       
        const messagePromises = message.map(async (a:any) => {
            const staffInfo:any = await UsersModel.findOne({
                where: {
                    id: a.senderId
                },
                attributes: ["fullname"]
            });
         // Assuming staffInfo contains the sender's name
            const messageWithSenderName = {
                message: a.message,
                senderName: staffInfo ? staffInfo?.dataValues?.fullname : 'Unknown'
            };
            console.log(messageWithSenderName,'message')
            return messageWithSenderName;
        });
        
        // Wait for all promises to resolve
        const result = await Promise.all(messagePromises);
      
        return res.json({
            status: true,
            message: 'messages retrieved',
            data: result
        });
        
        
        

       }catch(err){
        return res.json({
            status:false,
            message:`an error occured ${err}`
        })
       }
        
    }
}

const messageController = new MessageController();
export default messageController;
