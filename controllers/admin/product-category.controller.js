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
  //console.log(product)
  await record.save();

  res.redirect(`${configSystem.prefixAdmin}/products-category`);
};
