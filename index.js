const express = require("express");

require("dotenv").config();

const database = require("./config/database");
const systemConfig=require("./config/system")
//ROUTER
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = 3000;

// configure pug into project
app.set("views", "./views");
app.set("view engine", "pug");
//App Locals Variables
app.locals.prefixAdmin=systemConfig.prefixAdmin

app.use(express.static("public"));
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
