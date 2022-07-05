const express= require('express')

const Book= require('../models/book')


const router=express.Router()

router.get('/', async(req,res)=>{

    let books
    try {

         books= await Book.find().sort({createdat:'desc'}).limit(5).exec()

      
        
    } catch (error) {
        books=[]
    }
    res.render('index',{books:books})
  
})


module.exports=router