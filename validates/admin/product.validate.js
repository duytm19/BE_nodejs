module.exports.createPost = (req,res,next)=>{
    if(!req.body.title){
        req.flash("error", "Please enter title!")
        res.redirect("back")
        return
    }
    if(parseInt(req.body.discountPercentage) <0 || parseInt(req.body.discountPercentage) >100){
        req.flash("error", "Please enter discount percentage again. It must be from 0% to 100% !")
        res.redirect("back")
        return
    }
    next()
}