const User = require("../../models/user.model")
const md5 = require("md5")
//[GET] /user/register
module.exports.register = async (req,res)=>{
    res.render("client/pages/user/register",{
        pageTitle:"Sign Up Account"
    })
}

//[POST] /user/register
module.exports.registerPost = async(req,res)=>{
    const existEmail = await User.findOne({
        email: req.body.email
    })
    if(existEmail){
        req.flash("success","Email is existence!!!!")
        res.redirect("back")
        return
    }
    req.body.password = md5(req.body.password)

    const user = new User (req.body)
    await user.save()

    res.cookie("tokenUser",user.tokenUser)
    
    res.redirect("/")
}
//[GET] /user/login
module.exports.login = async (req,res)=>{
    res.render("client/pages/user/login",{
        pageTitle:"Sign in Account"
    })
}
//[POST] /user/login
module.exports.loginPost = async (req,res)=>{
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        email:email
    })

    if(!email){
        req.flash("error", "Account is not existence !!!")
        res.redirect("back")
        return
    }

    if(md5(password) != user.password){
        req.flash("error", "Password is incorrect !!!")
        res.redirect("back")
        return
    }
    if(user.status = "inactive"){
        req.flash("error", "Your account was locked !!!")
        res.redirect("back")
        return
    }

    res.cookie("tokenUser",user.tokenUser)

    res.redirect("/")
}