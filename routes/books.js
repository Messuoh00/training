const express= require('express')
const router=express.Router()
const Books = require('../models/book')
const Authors = require('../models/author')
const imgtypes=['image/jpeg','image/gif','image/png']




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


router.post('/',async (req,res)=>{
  
   
    
    const book=new Books({
        name:req.body.title,
        author:req.body.author,
        pagenum:req.body.pageCount,
        datepub:new Date(req.body.publishDate),
        description:req.body.description,
        
    })

  
  

    try {
      
      savecover(book,req.body.img)
      const newbook= await book.save()
    
      
       res.redirect('books')
        
    } catch (error) {
        
       
        console.log(error)
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




function savecover(book, coverE) {
  
    if (coverE!=null) {
     
     console.log(coverE)   
        
    const cover=JSON.parse(coverE)
   
    if(cover!=null &&  imgtypes.includes(cover.type)) {

        book.img=new Buffer.from(cover.data,'base64')

        book.imgtype=cover.type

 
    }
    
    }
   
}


module.exports=router