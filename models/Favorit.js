const mongoose =require("mongoose")

const FavoritSchema = new mongoose.Schema({
    user_id :{
        type: String,
        required: true
    }
    ,
    product_id :{
        type: String,
        required: true
    }

    
})
const FavoritModel =mongoose.model('favorit' ,FavoritSchema)
module.exports=FavoritModel