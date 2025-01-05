const Product=require("../../models/product.model")
const filterStatusHelper=require("../../helpers/filterStatus")
const searchHelper=require("../../helpers/search")
const paginationHelper=require("../../helpers/pagination")
//[GET] /admin/products
module.exports.index = async(req,res)=>{
    
    //filter status
    const filterStatus = filterStatusHelper(req.query)
    let find={
        deleted:false
    }
    if(req.query.status){
        find.status=req.query.status
    }
    //End filter status

    //Search
    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.title=objectSearch.regex
    }

    //End Search

    //Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination=paginationHelper(
        {
            limitItems: 4,
            currentPage: 1
        },
        req.query,
        countProducts
    )
   // console.log(objectPagination)
    //End Pagination
    const products= await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

    res.render("admin/pages/products/index",{
       pageTitle:"Trang danh sach product",
       products:products,
       filterStatus:filterStatus,
       keyword:objectSearch.keyword,
       pagination: objectPagination,
    })
 }