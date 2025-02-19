// Update quantity of product in cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']")
if(inputsQuantity.length>0){
    inputsQuantity.forEach(input =>{
        input.addEventListener("change",()=>{
            const productId = input.getAttribute("product-id")
            const quantity = input.value

            window.location.href = `/cart/update/${productId}/${quantity}`
        })
        
    })
}
// End Update quantity of product in cart