const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")
//[GET] /rooms-chat/
module.exports.index=async (req,res)=>{
    res.render("client/pages/rooms-chat/index",{
        pageTitle: "List Room"
    })
}
//[GET] /rooms-chat/create
module.exports.create = async (req,res)=>{
    const friendList = res.locals.user.friendList;

    for(const friend of friendList){
        const infoFriend = await User.findOne({
            _id: friend.user_id,
            deleted:false
        }).select('fullName avatar')

        friend.infoFriend = infoFriend
    }
    res.render("client/pages/rooms-chat/create",{
        pageTitle: "Create Room",
        friendList: friendList
    })
}
//[POST] /rooms-chat/create
module.exports.createPost = async (req,res)=>{
    const title = req.body.title
    const usersId = req.body.usersId

    const dataRoom={
        title:title,
        typeRoom:"group",
        users:[]
    }
    for(const userId of usersId){
        dataRoom.push({
            user_id:userId,
            role:"user"
        })
    }

    dataRoom.users.push({
        user_id:res.locals.user.id,
        role:"superAdmin"
    })

    const roomChat = new RoomChat(dataRoom)
    roomChat.save()
    res.redirect(`/chat/${roomChat.id}`)
}