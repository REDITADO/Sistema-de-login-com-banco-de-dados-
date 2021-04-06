const mysql = require('mysql')
const express=require('express')
const session = require('express-session')
const bodyParse=require('body-parser')
const path = require('path')
const app=express()
let connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodelogin'
})

app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized:false,
    cookie:{maxAge:0.5*60*1000}
}))
app.use(bodyParse.urlencoded({extended:true}))
app.use(bodyParse.json())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/login.html'))

})

app.post('/auth', (req,res)=>{
    let username = req.body.username;
    let senha = req.body.password
    if(username&&senha){
        connection.query('SELECT * FROM accounts WHERE username=? AND senha=?',[username,senha],(err,result,field)=>{
            console.log(result)
            if(result.length >0){
                req.session.loggedin =true
                req.session.username=username
                res.redirect('/home')
            }else{
                res.send('senha ou usuario incorretos')
            }
            res.end()
        } )
    }else{
        res.send('Please enter with username and password')
        res.end()
    }
})

app.get('/home',(req,res)=>{
    if(req.session.loggedin){
        console.log(req.session.loggedin)
        res.send('Welcome Back,'+req.session.username+'!')

    }else{
        res.send('logue para ver esta page')
    }
    res.end()
})

app.listen(2002)