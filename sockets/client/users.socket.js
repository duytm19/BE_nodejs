const User = require("../../models/user.model")

module.exports = (res)=>{
    
    _io.once('connection',(socket)=>{
        //Save message in database

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
            
        })

        //Cancel request
        socket.on("CLIENT_CANCEL_FRIEND", async (userId)=>{

            const myUserId = res.locals.user.id
            
            // Delete A in accept friends of B

            const existAinB= await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if(!existAinB){
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

            if(!existBinA){
                await User.updateOne({
                    _id: myUserId
                },{
                    $pull: {requestFriends: userId}
                })
            }
            
        })
    })
}