const uploadToCloudinaryHelper = require("../../helpers/uploadToCloudinary")
module.exports.upload = async (req,res,next)=>{
  if(req.file){
    const link = await uploadToCloudinaryHelper(req.file.buffer)
    req.body[req.file.fieldname] = link
  }
  next()  
}