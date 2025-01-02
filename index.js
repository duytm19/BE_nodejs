const express= require("express")

require("dotenv").config()

const database=require("./config/database")
//ROUTER
const route=require("./routes/client/index.route")

database.connect()

const app=express()
const port=3000

// configure pug into project
app.set("views","./views")
app.set("view engine","pug")

app.use(express.static("public"))
route(app)

app.listen(port,()=>{
    console.log(`App is running at http://localhost:${port}`);
})