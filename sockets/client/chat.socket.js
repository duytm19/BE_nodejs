const Chat = require('../../models/chat.model')
const uploadToCloudinaryHelper = require("../../helpers/uploadToCloudinary")

module.exports = async(req,res)=>{
    const userId = res.locals.user.id  
    const fullName = res.locals.user.fullName

    const roomChatId=req.params.roomChatId

    _io.once('connection',(socket)=>{

        socket.join(roomChatId)

        //Save message in database
        socket.on("CLIENT_SEND_MESSAGE", async (data)=>{
            let images = []
            for (const imageBuffer of data.images){
                const link = await uploadToCloudinaryHelper(imageBuffer)
                images.push(link)
            }

            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId,
                content: data.content,
                images: images
            })
            await chat.save()

            //Server return message

            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE",{
                userId: userId,
                fullName:fullName,
                content:data.content,
                images: images 
            })
            //End Server return message
        })
        //Typing
        socket.on("CLIENT_SEND_TYPING", async (type)=>{
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING",{
                userId: userId,
                fullName:fullName,
                type:type
            })
        })
    })
}