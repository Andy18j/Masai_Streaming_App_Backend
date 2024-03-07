const mongoose = require("mongoose")


const videoSchema = mongoose.Schema({
    filename: String, 
    path: String, 
    size: Number, 
    contentType: String, 
    createdAt: {
      type: Date,
      default: Date.now
    }
})

const videoModel = mongoose.model("video",videoSchema)


module.exports = {
    videoModel
}