//Button status
const buttonStatus = document.querySelectorAll("[button-status]")
if(buttonStatus.length>0){
    let url=new URL(window.location.href)

    buttonStatus.forEach(button=>{
        button.addEventListener("click",()=>{
            const status=button.getAttribute("button-status")
            if(status){
                url.searchParams.set("status",status)
            }
            else{
                url.searchParams.delete("status")
            }
            window.location.href=url.href
        })
    })
}
//End Button status

//Form search
const formSearch= document.querySelector("#form-search")
if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit",(e)=>{
        e.preventDefault()
        const keyword=e.target.elements.keyword.value
        //console.log(keyword)
        if(keyword){
            url.searchParams.set("keyword",keyword)
        }
        else{
            url.searchParams.delete("keyword")
        }
        window.location.href=url.href
    })
}
//End Form search
//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination){
    let url = new URL(window.location.href)

    buttonsPagination.forEach(button=>{
        button.addEventListener("click",()=>{
            const page=button.getAttribute("button-pagination")

            url.searchParams.set("page",page)

            window.location.href=url.href
        })
    })
}
//End Pagination

//Checkbox Multi
const checkboxMulti=document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']")

    inputCheckAll.addEventListener("click",()=>{
        if(inputCheckAll.checked){
            inputsId.forEach(input =>{
                input.checked=true
            })
        }else{
            inputsId.forEach(input =>{
                input.checked=false
            })
        }
    })

    inputsId.forEach(input=>{
        input.addEventListener("click",()=>{
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
            if(countChecked==inputsId.length){
                inputCheckAll.checked=true
            }
            else{
                inputCheckAll.checked=false
            }
        })

    })
}
//End Checkbox Multi

//Form change multi
const formChangeMulti=document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(e)=>{
        e.preventDefault()

        const checkboxMulti=document.querySelector("[checkbox-multi]")

        inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        )
        
        const typeChange = e.target.elements.type.value

        if(typeChange=="delete-all"){
            const isConfirm=confirm("Do you want to delete ticked items?")
            if(!isConfirm){
                return
            }
        }

        if(inputsChecked.length>0){
            let ids=[]
            const inputsId=formChangeMulti.querySelector("input[name='ids']")
            
            inputsChecked.forEach(input=>{
                const id =input.getAttribute("value")
                if(typeChange=="change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    //console.log("JOOOOOOOOOOO")
                    ids.push(`${id}-${position}`)
                }
                else{
                    ids.push(id)
                }
                
                
            })
            inputsId.value=ids.join(", ")
            formChangeMulti.submit()
        }
        else{
            alert("Please choose at least one product!")
        }
    })
}
//End Form change multi

//Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]")
if(buttonDelete.length>0){
    const formDeleteItem = document.querySelector("#form-delete-item")
    const path = formDeleteItem.getAttribute("data-path")

    buttonDelete.forEach(button=>{
        button.addEventListener("click",()=>{
            const isConfirm = confirm("Do you want to delete this item?")

            if(isConfirm){
                const id = button.getAttribute("data-id")

                const action= `${path}/${id}?_method=DELETE`

                formDeleteItem.action=action

                formDeleteItem.submit()

            }
        })
    })
}
//End Delete Item

//Show alert

const showAlert = document.querySelector("[show-alert]")
const closeAlert =document.querySelector("[close-alert]")
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"))

    setTimeout(()=>{
        showAlert.classList.add("alert-hidden")
    },time)



    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden")
     })
}

//End Show alert

//Upload Image
const uploadImage= document.querySelector("[upload-image]")
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview= document.querySelector("[upload-image-preview]")
    const closeImagePreview=document.querySelector("[delete-image-preview]")
    uploadImageInput.addEventListener("change",(e)=>{ // e - element catch event of uploadImageInput
        const file = e.target.files[0] // e.target = uploadImageInput
        if(file){
            uploadImagePreview.src= URL.createObjectURL(file)
            closeImagePreview.classList.remove('delete-hidden');
            closeImagePreview.classList.add('delete-visible');
        }
    })
    closeImagePreview.addEventListener("click", ()=>{
        uploadImageInput.value=""
        uploadImagePreview.src=""
        closeImagePreview.classList.remove('delete-visible');
        closeImagePreview.classList.add('delete-hidden');
    })
}
//End Upload Image