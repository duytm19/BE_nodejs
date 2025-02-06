const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");
//const validate = require("../../validates/admin/product.validate")

router.get("/", controller.index);



// router.patch("/change-multi",controller.changeMulti)

// router.delete("/delete/:id",controller.deleteItem)

router.get("/create",controller.create)

router.post("/create", controller.createPost)

router.get("/edit/:id", controller.edit)

router.patch("/edit/:id", controller.editPatch)

// router.get("/detail/:id", controller.detail)

module.exports = router;
