const express = require("express")
const cors = require("cors")
const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.route")
require("dotenv").config()





const app = express()
app.use(express.json())
app.use(cors())

app.use("/user",userRouter)

app.get("/",(req,res)=>{
    res.send("Welcome TO Masai Live Streaming App🙏")
})


app.listen(process.env.PORT,async()=>{
    try{
          await connection
          console.log("Connected")
    }
    catch(err){
        console.log(err)
        console.log("Not Connected To The DB")
    }
    console.log(`port is running on the ${process.env.PORT}`)
})