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

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req,res)=>{
    //console.log(req.params)
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({_id: id},{status: status})

    res.redirect("back")
}
//[PATCH]/admin/products/change-multi
module.exports.changeMulti = async(req,res)=>{
   // console.log(req.body)
    const type=req.body.type
    const ids=req.body.ids.split(", ")
    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"})
            break
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"})
            break
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}},{deleted:true},{deletedAt: new Date()})
        default:
            break 
    }
    res.redirect("back")
}
//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req,res)=>{
    
    const id = req.params.id

    //await Product.deleteOne({_id: id}) //Delete in Database

    await Product.updateOne({_id:id },{deleted:true},{deletedAt: new Date()})

    res.redirect("back")
}