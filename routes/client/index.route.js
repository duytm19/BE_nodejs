const homeRoutes = require("./home.route")
const productRoutes=require("./product.route")
module.exports=(app)=>{
app.use("/home",homeRoutes)

app.use("/products",productRoutes)
}