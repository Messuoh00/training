const mongoose = require('mongoose')
const coverimgbasepath='uploads/bookcovers'
const path=require('path')

const  bookSchema= new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },

        pagenum:{
            type: Number,
            required: true,
        },

        description:{
            type: String,
           
        },

        datepub:{
            type: Date,
            required: true,
        },

  

        createdat:{
            type: Date,
            required: true,
            default: Date.now
        },

        img:{
            type: Buffer,
            required: true,
       
        },

        imgtype:{
            type: String,
            required: true,
        },

        author:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'author',
        }
    }
)

bookSchema.virtual('imgpath').get(function () {
    if (this.img!=null) {
        
       return path.join('/',coverimgbasepath,this.img)
    }
})

module.exports=mongoose.model('book',bookSchema)
module.exports.coverimgbasepath=coverimgbasepath