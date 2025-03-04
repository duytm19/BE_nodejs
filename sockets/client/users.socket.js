const User = require("../../models/user.model")

module.exports = async (res)=>{
    
    _io.once('connection',(socket)=>{

        // Send request
        socket.on("CLIENT_ADD_FRIEND", async (userId)=>{

            const myUserId = res.locals.user.id
            //console.log(userId)
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
            
            // Delete A in accept friends of B
            // Add A in friendlist of B
            const existAinB= await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if(existAinB){
                await User.updateOne({
                    _id: myUserId
                },{
                    $push:{
                        friendList:[{
                            user_id:userId,
                            room_chat_id:""
                            }]
                    },
                    $pull: {acceptFriends: userId}
                })
            }

            // Delete B in request friends of A
            // Add B in friendlist of A
            const existBinA= await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if(existBinA){
                await User.updateOne({
                    _id: userId
                },{
                    $push:{
                        friendList:[{
                            user_id:myUserId,
                            room_chat_id:""
                            }]
                    },
                    $pull: {requestFriends: myUserId}
                })
            }
            
        })
    })
}