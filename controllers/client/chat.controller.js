const Chat = require('../../models/chat.model')
const User = require("../../models/user.model")

const chatSocket = require('../../sockets/client/chat.socket')

//[GET] /chat/

module.exports.index= async (req,res)=>{
    const roomChatId = req.params.roomChatId
    
    //Socket IO
    await chatSocket(req,res)
    //End Socket IO
    
    // Get data messsage from database

    const chats = await Chat.find({
        room_chat_id:roomChatId,
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