module.exports.loginPost = (req,res,next)=>{
    if(!req.body.email){
        req.flash("error", "Please enter email!")
        res.redirect("back")
        return
    }
    if(!req.body.password){
        req.flash("error", "Please enter password!")
        res.redirect("back")
        return
    }
    next()
}
module.exports.registerPost = (req,res,next)=>{
    if(!req.body.fullName){
        req.flash("error", "Please enter name!")
        res.redirect("back")
        return
    }
    if(!req.body.email){
        req.flash("error", "Please enter email!")
        res.redirect("back")
        return
    }
    if(!req.body.password){
        req.flash("error", "Please enter password!")
        res.redirect("back")
        return
    }
    next()
}
module.exports.forgotPasswordPost = (req,res,next)=>{
    if(!req.body.email){
        req.flash("error", "Please enter email!")
        res.redirect("back")
        return
    }
    next()
}

module.exports.resetPasswordPost = (req,res,next)=>{
    if(!req.body.password){
        req.flash("error", "Please enter Password!")
        res.redirect("back")
        return
    }

    if(!req.body.confirmPassword){
        req.flash("error", "Please enter Confirm Password!")
        res.redirect("back")
        return
    }

    if(req.body.password!=req.body.confirmPassword){
        req.flash("error", "Password and Confirm Password do not match!!!")
        res.redirect("back")
        return
    }
    next()
}