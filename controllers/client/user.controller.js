const User = require("../../models/user.model")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")
const ForgotPassword = require('../../models/forgot-password.models')
const sendMailHelper = require('../../helpers/sendEmail')
const Cart = require("../../models/cart.model")
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
    if(user.status == "inactive"){
        req.flash("error", "Your account was locked !!!")
        res.redirect("back")
        return
    }
    const cart = await Cart.findOne({
        user_id:user.id
    })

    if(cart){
        res.cookie("cartId", cart.id)
    }
    else{
        await Cart.updateOne({
            _id: req.cookies.cartId
        },{
            user_id: user.id
        })
    }
    
    res.cookie("tokenUser",user.tokenUser)

    await User.updateOne({
        tokenUser:user.tokenUser
    },{
        statusOnline:"online"
    })
    res.redirect("/")
}
//[GET] /user/logout
module.exports.logout = async (req,res) =>{
    await User.updateOne({
        tokenUser:req.cookies.tokenUser
    },{
        statusOnline:"offline"
    })

    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
    res.redirect("/")
}
//[GET] /user/password/forgot
module.exports.forgotPassword = async (req,res)=>{
    res.render("client/pages/user/forgot-password",{
        pageTitle:"Forgot Password"
    })
}
//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req,res)=>{
    const email = req.body.email

    const user = await User.findOne({
        email:email,
        deleted: false
    })

    if(!email){
        req.flash("error", "Account is not existence !!!")
        res.redirect("back")
        return
    }

    const otp = generateHelper.generateRandomNumber(8)

    const objectForgotPassword ={
        email: email,
        otp:otp,
        expireAt:Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)

    await forgotPassword.save()

    //Send OTP
    const subject = "OTP CODE TO RESET YOUR PASSWORD"
    const html = `<h3> OTP CODE TO RESET YOUR PASSWORD: </h3>
    <b style="color: red;">${otp}</b>.<h3>The expired time is: 3 minutes</h3>
    `
    sendMailHelper.sendMail(email,subject,html)
    //End Send OTP

    res.redirect(`/user/password/otp?email=${email}`)
}

//[GET] /user/password/otp
module.exports.otpPassword = async (req,res) =>{
    const email = req.query.email

    res.render("client/pages/user/otp-password",{
        pageTitle: "OTP Authentication",
        email:email
    })
}

//[POSt] /user/password/otp
module.exports.otpPasswordPost = async (req,res) =>{
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email:email,
        otp:otp
    })

    if(!result){
        req.flash("error", "OTP is not available!!!")
        res.redirect("back")
        return
    }
    
    const user = await User.findOne({
        email:email
    })

    res.cookie("tokenUser", user.tokenUser)

    res.redirect(`/user/password/reset`)
}

//[GET] /user/password/reset
module.exports.resetPassword = async (req,res) =>{
    res.render("client/pages/user/reset-password",{
        pageTitle: "Reset Password",
    })
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req,res) =>{
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser

    await User.updateOne({
        tokenUser: tokenUser
    },{
        password: md5(password)
    })

    res.clearCookie("tokenUser")
    res.redirect("/user/login")
}

//[GET] /user/info
module.exports.info =async (req,res)=>{
    res.render("client/pages/user/info",{
        pageTitle: "User Information",
    })
}