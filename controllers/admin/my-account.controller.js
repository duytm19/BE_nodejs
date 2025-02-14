const Account = require("../../models/account.model");
const configSystem = require("../../config/system");
const Role = require("../../models/role.model");
const md5 = require("md5");
//[GET] /admin/my-account/
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
      pageTitle: "User Information ",
    });
};

//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
      pageTitle: "Edit User Information ",
    });
};
//[PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
  
    const emailExist = await Account.findOne({
      _id: {$ne:id},
      email: req.body.email,
      deleted: false,
    });
    if (emailExist) {
      req.flash("error", `Emai ${req.body.email} is exist!`);
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
      await Account.updateOne({ _id: id }, req.body);
      req.flash("success", "Update successfully! ");
    }
    res.redirect("back");

  };