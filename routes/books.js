const express= require('express')
const router=express.Router()

const Books = require('../models/book')
const Authors = require('../models/author')

const path=require('path')
const fs = require('fs')

const uploadpath=path.join('public',Books.coverimgbasepath)
const imgtypes=['image/jpeg','image/gif','image/png']
const multer= require('multer')
const { Console } = require('console')

const upload=multer({
    dest:uploadpath,
    fileFilter:(req,file,callback)=>{
        callback(null,imgtypes.includes(file.mimetype))
    }
    
})



router.get('/', async(req,res)=>{

    

    let query=Books.find()

    if(req.query.name !=null && req.query.name!==''){
        query=query.regex('name',RegExp(req.query.name,'i'))
    }

    if(req.query.before !=null && req.query.before!==''){
        query=query.lte('datepub',req.query.before)
    }

    if(req.query.after !=null && req.query.after!==''){
        query=query.gte('datepub',req.query.after)
    }

    try {
        const books=await query.exec()
        res.render('books/index',{books: books,searchoptions:req.query})
    } catch  {
        res.redirect('books/index',{books: new Books()})
    }


})


router.get('/new', async(req,res)=>{
   
    rendernewpage(res,new Books())
})


router.post('/',upload.single('img') ,async (req,res)=>{

    const filename =req.file!=null ? req.file.filename:null
    const book=new Books({
        name:req.body.title,
        author:req.body.author,
        pagenum:req.body.pageCount,
        datepub:new Date(req.body.publishDate),
        description:req.body.description,
        img:filename,
    })

    try {
        
       
        const newbook= await book.save()
    
      console.log(book.img)

        res.redirect('books')
        
    } catch (error) {
        
       if (book.img!=null) {
        removebook(book.img)
       }
       
        
        rendernewpage(res,book,true)
    }
    
})



async function  rendernewpage(res,book,haserr=false) {
    
    try {
    
        const auth= await Authors.find({})
        const params={
            authors:auth,
            book:book,
        }
        if(haserr) params.errorMessage='error creation'
        res.render('books/new',{book:book,authors:auth})
    
     } catch (error) {
        res.redirect('/books')
     }
}


function removebook(name) {
    
    fs.unlink(path.join(uploadpath,name),err=> {if (err) Console.console.error(err) } )
}


module.exports=router