const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")
//[GET] /
module.exports.index = async(req,res)=>{
    //Feature Product
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status:"active"
    })
    const newProducts = productsHelper.priceNewProducts(productsFeatured)

    // console.log(newProducts)
    res.render("client/pages/home/index",{
        pageTitle:"Home Page",
        productsFeatured:newProducts
    }
    )
}