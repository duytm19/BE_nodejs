const express = require("express");
const path = require('path'); 
require("dotenv").config();
const flash = require('express-flash')
const moment = require('moment')

const database = require("./config/database");
const systemConfig=require("./config/system")
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const http =require('http')
const {Server} = require('socket.io')

//ROUTER
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = 3000;

//Socket IO
const server = http.createServer(app)
const io = new Server(server)
global._io = io

// End Socket IO
// override POST to PATCH
app.use(methodOverride('_method'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// configure pug into project
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//flash
app.use(cookieParser('JAOOAFDD'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//End flash
// tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// End tiny MCE

//App Locals Variables
app.locals.prefixAdmin=systemConfig.prefixAdmin
app.locals.moment=moment

//Routes
app.use(express.static(`${__dirname}/public`));
routeAdmin(app);
route(app);
app.get("*",(req,res)=>{
  res.render("client/pages/errors/404",{
    pageTitle: "404 Not Found"
  })
})

server.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
