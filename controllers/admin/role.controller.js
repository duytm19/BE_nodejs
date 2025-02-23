const Role = require("../../models/role.model");
const configSystem = require("../../config/system");

//[GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: "Permissions Management",
    records: records,
  });
};
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Add new permission",
  });
};
//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${configSystem.prefixAdmin}/roles`);
};
//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };

    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Edit permission",
      data: data,
    });
  } catch (error) {
    res.redirect(`${configSystem.prefixAdmin}/roles`);
  }
};

//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  await Role.updateOne({ _id: id }, req.body);

  res.redirect("back");
};

//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find ={
        deleted:false
    }
    const records = await Role.find(find)
    res.render("admin/pages/roles/permissions",{
        pageTitle: "Permissions",
        records:records
    })
};
//[PATCH] /admin/roles/permissions
module.exports.permissionsPatch=async (req,res)=>{
    const permissions = JSON.parse(req.body.permissions)
    
    for(const item of permissions){
        await Role.updateOne({_id:item.id},{
            permissions: item.permissions
        })
    }
    req.flash("success","Update Successful!")
    res.redirect("back")
}