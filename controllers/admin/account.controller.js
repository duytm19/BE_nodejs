const Account = require("../../models/account.model");
const configSystem = require("../../config/system");
const Role = require("../../models/role.model");
const md5 = require("md5");
//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Accounts Management",
    records: records,
  });
};
//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Add new accounts",
    roles: roles,
  });
};
//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Emai ${req.body.email} is exist!`);
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${configSystem.prefixAdmin}/accounts`);
  }
};
//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };

    const data = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false,
    });
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Edit accounts",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${configSystem.prefixAdmin}/accounts`);
  }
};

//[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

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
    res.redirect("back");
  }
};

//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Permissions",
    records: records,
  });
};
//[PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  console.log(permissions);
  for (const item of permissions) {
    await Role.updateOne(
      { _id: item.id },
      {
        permissions: item.permissions,
      }
    );
  }
  req.flash("success", "Update Successful!");
  res.redirect("back");
};
//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req,res)=>{
  //console.log(req.params)
  const status = req.params.status
  const id = req.params.id

  await Account.updateOne({_id: id},{status: status})

  req.flash('success','Update status of account successfully!')
  //req.flash('success', 'Welcome');

  res.redirect("back")
}
//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req,res)=>{
    
  const id = req.params.id

  //await Product.deleteOne({_id: id}) //Delete in Database

  await Account.updateOne({_id:id },{deleted:true})
  req.flash('success',`Delete an account successfully!`)

  res.redirect("back")
}