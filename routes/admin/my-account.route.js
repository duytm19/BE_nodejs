const express = require("express");
const router = express.Router();
const multer  = require('multer')
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")

const controller = require("../../controllers/admin/my-account.controller");
const validate = require("../../validates/admin/account.validate")

router.get("/", controller.index);



// router.patch("/change-multi",controller.changeMulti)

// router.delete("/delete/:id",controller.deleteItem)

// router.get("/create",controller.create)

// router.post("/create", controller.createPost)

router.get("/edit", controller.edit)

router.patch("/edit", 
    upload.single('avatar'),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch)


module.exports = router;
