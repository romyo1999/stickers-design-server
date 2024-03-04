const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    first_name:{
        type: String,
    },
    last_name:{
        type: String,
    },
    email:{
        type: String,
    },
    password:{
        type:String
    }
    ,
    role:{
        type:String
    }
})

const UserModel = model("users", UserSchema)
module.exports = UserModel