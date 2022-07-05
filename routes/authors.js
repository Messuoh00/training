const express= require('express')

const router=express.Router()
const Author = require('../models/author')



router.get('/', async(req,res)=>{

    let searchoptions={}

    if(req.query.name !=null && req.query.name!==''){
        searchoptions.name=new RegExp(req.query.name,'i')
        searchoptions.lastname=new RegExp(req.query.lastname,'i')
    }

    try {
        const authors=await Author.find(searchoptions)
        res.render('authors/index',{authors: authors,searchoptions:req.query})
    } catch  {
        res.redirect('/')
    }


   
})


router.get('/new', (req,res)=>{

    res.render('authors/new', {author: new Author()} )
})


router.post('/', async (req,res)=>{

    const author=new Author({
        name:req.body.name,
        lastname:req.body.lastname,
    })

    try {
      const newauth=await author.save()
       // res.redirect(`authors/${newAuth.id}`)
       res.redirect('authors')
        
    } catch (error) {
        console.log(error)
        res.render('authors/new', {author: author,errmsg:'error'} )
    }

    
})



module.exports=router