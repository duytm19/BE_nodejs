// Send request add friend
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if(listBtnAddFriend.length>0){
    listBtnAddFriend.forEach(button=>{
        button.addEventListener("click",()=>{
            button.closest(".box-user").classList.add("add")

            const userId = button.getAttribute("btn-add-friend")
            
            socket.emit("CLIENT_ADD_FRIEND",userId)
        })
    })
}
// End Send request add friend

//  cancel add friend
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if(listBtnCancelFriend.length>0){
    listBtnCancelFriend.forEach(button=>{
        button.addEventListener("click",()=>{
            button.closest(".box-user").classList.remove("add")

            const userId = button.getAttribute("btn-cancel-friend")
            
            socket.emit("CLIENT_CANCEL_FRIEND",userId)
        })
    })
}
// End cancel request add friend

// Refuse request add friend
const listBtnRefuselFriend = document.querySelectorAll("[btn-refuse-friend]")
if(listBtnRefuselFriend.length>0){
    listBtnRefuselFriend.forEach(button=>{
        button.addEventListener("click",()=>{
            button.closest(".box-user").classList.add("refuse")

            const userId = button.getAttribute("btn-refuse-friend")
            console.log(userId)
            socket.emit("CLIENT_REFUSE_FRIEND",userId)
        })
    })
}
// End Refuse request add friend