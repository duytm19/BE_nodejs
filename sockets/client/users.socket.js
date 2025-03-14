const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")
module.exports = async (res)=>{
    
    _io.once('connection',(socket)=>{

        // Send request
        socket.on("CLIENT_ADD_FRIEND", async (userId)=>{

            const myUserId = res.locals.user.id
           
            
            // Add A into accept friends of B

    
            const existAinB= await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if(!existAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $push: {acceptFriends: myUserId}
                })
            }

            // Add B into request friends of A

            const existBinA= await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if(!existBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push: {requestFriends: userId}
                })
            }
            // Get length  acceptFriend of B and return it to B
            const infoUserB = await User.findOne({
                _id:userId
            }) 
            const lengthAcceptFriends = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId:userId,
                lengthAcceptFriends:lengthAcceptFriends
            })
                // A send request to B, in B accept real-time
                // GET info of A and return to B
                const infoUserA = await User.findOne({
                    _id: myUserId,
                }).select("id avatar fullName")

                socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND",{
                    userId:userId,
                    infoUserA:infoUserA
                })
        })

        //Cancel request
        socket.on("CLIENT_CANCEL_FRIEND", async (userId)=>{

            const myUserId = res.locals.user.id
            
            // Delete A in accept friends of B

            const existAinB= await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if(existAinB){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {acceptFriends: myUserId}
                })
            }

            // Delete B in request friends of A

            const existBinA= await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if(existBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {requestFriends: userId}
                })
            }
            // Get length  acceptFriend of B and return it to B
            const infoUserB = await User.findOne({
                _id:userId
            }) 
            const lengthAcceptFriends = infoUserB.acceptFriends.length;
            
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId:userId,
                lengthAcceptFriends:lengthAcceptFriends
            })
            
            // Get id of A and return to B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND",{
                userIdB:userId,
                userIdA:myUserId
            })
        })

        //Refuse request
        socket.on("CLIENT_REFUSE_FRIEND", async (userId)=>{

            const myUserId = res.locals.user.id
            
            // Delete A in accept friends of B

            const existAinB= await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if(existAinB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {acceptFriends: userId}
                })
            }

            // Delete B in request friends of A

            const existBinA= await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if(existBinA){
                await User.updateOne({
                    _id: userId
                },{
                    $pull: {requestFriends: myUserId}
                })
            }
            
        })
        //Accept request
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId)=>{

            const myUserId = res.locals.user.id
             //Check exist
            const existAinB= await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            const existBinA= await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            //End check exits
            //Create RoomChat
            let roomChat
            if(existAinB && existBinA){
            const dataRoom={
                typeRoom:"friend",
                users:[
                    {
                        user_id:userId,
                        role:"superAdmin"
                    },
                    {
                        user_id:myUserId,
                        role:"superAdmin"
                    }
                ]
            }
            roomChat = new RoomChat(dataRoom)
            await roomChat.save()
        }
        //End create room chat
            // Delete A in accept friends of B
            // Add A in friendlist of B
           

            if(existAinB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push:{
                        friendList:[{
                            user_id:userId,
                            room_chat_id:roomChat.id
                            }]
                    },
                    $pull: {acceptFriends: userId}
                })
            }

            // Delete B in request friends of A
            // Add B in friendlist of A
          

            if(existBinA){
                await User.updateOne({
                    _id: userId
                },{
                    $push:{
                        friendList:[{
                            user_id:myUserId,
                            room_chat_id:roomChat.id
                            }]
                    },
                    $pull: {requestFriends: myUserId}
                })
            }
            
        })
    })
}
