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

        if(inputsChecked.length>0){
            let ids=[]
            const inputsId=document.querySelector("input[name='ids']")

            inputsChecked.forEach(input=>{
                const id =input.getAttribute("value")
                ids.push(id)
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
