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
const refuseFriend= (button)=>{
    button.addEventListener("click",()=>{
        button.closest(".box-user").classList.add("refuse")

        const userId = button.getAttribute("btn-refuse-friend")
        
        socket.emit("CLIENT_REFUSE_FRIEND",userId)
    })
}
const listBtnRefuselFriend = document.querySelectorAll("[btn-refuse-friend]")
if(listBtnRefuselFriend.length>0){
    listBtnRefuselFriend.forEach(button=>{
        refuseFriend(button)
    })
}
// End Refuse request add friend
// Accept request add friend
const acceptFriend = (button)=>{
    button.addEventListener("click",()=>{
        button.closest(".box-user").classList.add("accepted")

        const userId = button.getAttribute("btn-accept-friend")
        
        socket.emit("CLIENT_ACCEPT_FRIEND",userId)
    })
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if(listBtnAcceptFriend.length>0){
    listBtnAcceptFriend.forEach(button=>{
        acceptFriend(button)
    })
}
// End Accept request add friend

// SERVER RETURN LENGTH ACCEPT FRIEND
const badgeUserAccept = document.querySelector("[badge-users-accept]")
if(badgeUserAccept){
    const userId = badgeUserAccept.getAttribute("badge-users-accept")
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",(data)=>{
        
        //console.log(data.lengthAcceptFriends)
        if(userId == data.userId){
            badgeUserAccept.innerHTML = data.lengthAcceptFriends
        }
    })
}
// END SERVER RETURN LENGTH ACCEPT FRIEND
// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND",(data)=>{
const dataUserAccept = document.querySelector("[data-users-accept]")
// Accept Page
if(dataUserAccept){
    const userId = dataUserAccept.getAttribute("data-users-accept")
   
        
        if(userId === data.userId){
            // Draw user UI
            const div = document.createElement("div")
            div.classList.add("col-6")
            div.setAttribute("user-id",data.infoUserA._id)
            div.innerHTML=
            `
             <div class="box-user">
                <div class="inner-avatar">
                    <img src="/images/avatar.jpg" alt=${data.infoUserA.fullName}>
                </div>
                <div class="inner-info">
                    <div class="inner-name">${data.infoUserA.fullName}</div>
                    <div class="inner-button">
                        <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA._id}>Accept</button>
                        <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoUserA._id}>Refuse</button>
                        <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend=${data.infoUserA._id} disable="">Deleted</button>
                        <button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend=${data.infoUserA._id} disable="">Accepted</button>
                    </div>
                </div>
             </div>
            
            `

            dataUserAccept.appendChild(div)
            // End Draw user UI

            // Refuse request
            const buttonRefuse =div.querySelector("[btn-refuse-friend]")
            refuseFriend(buttonRefuse)
            // End Refuse request 
            //  Accept Request
            const buttonAccept =div.querySelector("[btn-accept-friend]")
            acceptFriend(buttonAccept)
            // End Accept Request

        }
    }
    // Not Friend Page
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
    if(dataUsersNotFriend){
        const userId= dataUsersNotFriend.getAttribute("data-users-not-friend")
        if(userId==data.userId){
            const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id='${data.infoUserA._id}']`)
            if(boxUserRemove){
                dataUsersNotFriend.removeChild(boxUserRemove)
            }
        }
    }
})
// END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND",(data)=>{
    const boxUserRemove =document.querySelector(`[user-id='${data.userIdA}']`)
    if(boxUserRemove){
        const dataUserAccept = document.querySelector("[data-users-accept]")
        const badgeUserAccept = document.querySelector("[badge-users-accept]")
        const userIdB = badgeUserAccept.getAttribute("badge-users-accept")
        if(userIdB==data.userIdB){
            dataUserAccept.removeChild(boxUserRemove)
        }
    }
})
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND
//  SERVER_RETURN_USER_STATUS_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE",(data)=>{
    const dataUsersFriend = document.querySelector("[data-users-friend]")
    if(dataUsersFriend){
        const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`)
        if(boxUser){
            const boxStatus=boxUser.querySelector("[status]")
            boxStatus.setAttribute("status",data.status)
        }
    }
})
// End SERVER_RETURN_USER_STATUS_ONLINE