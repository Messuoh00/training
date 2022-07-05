
if (process.env.NODE_ENV!=='production') {
    require('dotenv').config()
}

const express= require('express')

const app=express()

const expresslayouts=require('express-ejs-layouts')

const bodyparser = require('body-parser')

const indexroute=require('./routes/index')
const authorsroute=require('./routes/authors')
const booksroute=require('./routes/books')

const mongoose = require('mongoose')



mongoose.connect(process.env.DATABASE_URL,{usenewURLparser: true})

const db = mongoose.connection

db.on('error',error=>console.error('error'))
db.on('open',()=>console.log('rahi tmchi yay connected to mongogdb:)'))



app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(expresslayouts)
app.use(express.static('public'))

app.use(bodyparser.urlencoded({limit:'20mb',extended: false}))

app.use('/',indexroute)
app.use('/authors',authorsroute)
app.use('/books',booksroute)

app.listen(process.env.PORT || 3000)