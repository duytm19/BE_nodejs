const Product=require("../../models/product.model")
const filterStatusHelper=require("../../helpers/filterStatus")
const searchHelper=require("../../helpers/search")
const paginationHelper=require("../../helpers/pagination")
const configSystem = require("../../config/system")
//const cloudinary = require("../../helpers/cloudinary")

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

    // Sort
    let sort = {}
    if(req.query.sortKey & req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{
        sort.position="desc"
    }
    // End Sort
    const products= await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip)

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

    req.flash('success','Update status of product successfully!')
    //req.flash('success', 'Welcome');

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
            req.flash('success',`Update status of ${ids.length} products successfully!`)
            break
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"})
            req.flash('success',`Update status of ${ids.length} products successfully!`)
            break
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}},{deleted:true},{deletedAt: new Date()})
            req.flash('success',`Delete ${ids.length} products successfully!`)
            break
        case "change-position":
            for(item of ids){
                let [id,position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id: id},{position: position})
            }
            break    
        default:
            break 
    }
    res.redirect("back")
}
//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req,res)=>{
    
    const id = req.params.id

    //await Product.deleteOne({_id: id}) //Delete in Database

    await Product.updateOne({_id:id },{deleted:true})
    req.flash('success',`Delete a product successfully!`)

    res.redirect("back")
}

//[GET] /admin/products/create
module.exports.create = async(req,res)=>{
    
    res.render("admin/pages/products/create",{
       pageTitle:"Thêm mới sản phẩm",
    })
 }
 //[POST] /admin/products/create
module.exports.createPost = async (req,res)=>{
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage= parseInt(req.body.price)
    req.body.stock = parseInt(req.body.stock)
  
    //console.log(req.file)
    if(req.body.position == ""){
      const countProducts = await Product.countDocuments()
      req.body.position=countProducts+1
    }
    else{
      req.body.position=parseInt(req.body.position)
    }
  
    const product = new Product(req.body)
    //console.log(product)
    await product.save()
  
    res.redirect(`${configSystem.prefixAdmin}/products`)
    
}
//[GET] /admin/products/edit/:id
module.exports.edit = async(req,res)=>{
    
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render("admin/pages/products/edit",{
           pageTitle:"Edit Product",
           product:product
        })
    }
    catch(error){
        req.flash("error", "Can't show product, you want to edit ! Please try again")
        res.redirect(`${configSystem.prefixAdmin}/products`)
    }
   
 }
 //[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req,res)=>{
    const id =req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage= parseInt(req.body.price)
    req.body.stock = parseInt(req.body.stock)
    req.body.position=parseInt(req.body.position)
    if(req.file){
    req.body.thumbnail=`/uploads/${req.file.filename}`
    }
   // console.log(req.body)
    try{
        await Product.updateOne({_id: id}, req.body)
        req.flash("success","Edit product successfully!")
    }
    catch(error){
        req.flash("error","Can't edit product!")

    }
  
    res.redirect(`${configSystem.prefixAdmin}/products`)
    
}

//[GET] /admin/products/detail/:id
module.exports.detail = async(req,res)=>{
    
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
        res.render("admin/pages/products/detail",{
           pageTitle:product.title,
           product:product
        })
    }
    catch(error){
        req.flash("error", "Can't show detail product ! Please try again")
        res.redirect(`${configSystem.prefixAdmin}/products`)
    }
   
 }