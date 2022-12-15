//
const {Schema,model} = require("mongoose")
// crear el schema

const newsSchema = new Schema({
    //campos que contendra mi modelo
    content:{
        type:String,
        minLength:1,
        maxLength:140,
        required:true
    },
    //images:["http://dylan.com/png.","http://dylan.com/png.","http://dylan.com/png.","http://dylan.com/png."]
    images:{
        type:[String]
    },
    _owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true
    }
},{ timestamps: true})

//!important exportar

module.exports = model("News",newsSchema)