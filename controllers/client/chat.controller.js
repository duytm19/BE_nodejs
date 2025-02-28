const Chat = require('../../models/chat.model')
const User = require("../../models/user.model")

//[GET] /chat/

module.exports.index= async (req,res)=>{
    const userId = res.locals.user.id  
    const fullName = res.locals.user.fullName
    //Socket IO
    _io.once('connection',(socket)=>{
        //Save message in database
        socket.on("CLIENT_SEND_MESSAGE", async (content)=>{
            const chat = new Chat({
                user_id: userId,
                content: content
            })
            await chat.save()

            //Server return message

            _io.emit("SERVER_RETURN_MESSAGE",{
                userId: userId,
                fullName:fullName,
                content:content
            })
            //End Server return message
        })
        //Typing
        socket.on("CLIENT_SEND_TYPING", async (type)=>{
            socket.broadcast.emit("SERVER_RETURN_TYPING",{
                userId: userId,
                fullName:fullName,
                type:type
            })
        })
    })
    //End Socket IO

    // Get data messsage from database

    const chats = await Chat.find({
        deleted:false
    })
    for(const chat of chats){
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName")
        chat.infoUser = infoUser
    }

    // End Get data messsage from database

    res.render("client/pages/chat/index",{
        pageTitle: 'Chat',
        chats: chats
    })
}