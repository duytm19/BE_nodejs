const ProductCategory = require("../../models/product-category.model");
const configSystem = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree")
//[GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang danh muc product",
    records: newRecords,
  });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Thêm mới danh muc",
    records: newRecords,
  });
};
//[POST] /admin/products-categoty/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${configSystem.prefixAdmin}/products-category`);
};
//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try{
  const id = req.params.id

  let find = {
    deleted: false,
    _id: id
  };
  const data = await ProductCategory.findOne(find)

  const records = await ProductCategory.find( {deleted: false});

  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/edit", {
    pageTitle: "Thêm mới danh muc",
    records: newRecords,
    data: data
  });}
  catch{
    res.redirect(`${configSystem.prefixAdmin}/products-category`);
  }
};
//[PATCH] /admin/products-categoty/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id
  req.body.position= parseInt(req.body.position)

  await ProductCategory.updateOne({_id: id},req.body)

  res.redirect("back");
};
//[PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req,res)=>{
  //console.log(req.params)
  const status = req.params.status
  const id = req.params.id

  await ProductCategory.updateOne({_id: id},{status: status})

  req.flash('success','Update status of product successfully!')
  //req.flash('success', 'Welcome');

  res.redirect("back")
}
//[DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req,res)=>{
    
  const id = req.params.id



  await ProductCategory.updateOne({_id:id },{deleted:true})
  req.flash('success',`Delete a category successfully!`)

  res.redirect("back")
}