const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
      email : {type:String,required:true},
      password:{type:String,required:true},
      phone : {type:Number,required:true},
      gender : {type:String,required:true},
      createAt : {type:Date,default:Date.now}
})

const userModel = mongoose.model("user",userSchema)


module.exports = {
    userModel
}