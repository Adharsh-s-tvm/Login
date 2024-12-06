//const express = require("express");

const express = require("express");

const app = express();
const hbs = require('hbs');
const nocache = require('nocache')
const session = require('express-session')
app.use(express.static('public'));
app.set('view engine', 'hbs');
const username = "Adharsh"
const password = "pass123"


app.use(express.urlencoded({extended: true}));

app.use(express.json());


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

app.use(nocache())

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

app.get("/" , (req, res) => {

    if(req.session.user){
        res.render('home')
    }
    else{
        if(req.session.passswordwrong){
            res.render('login', {msg:"Invalid Username or Password"})
            req.session.passswordwrong = false
        }else{
            res.render('login')
        }
        
    }
})

app.post('/verify',(req, res)=>{

    console.log(req.body);
    
    if(req.body.username === username && req.body.password === password){

        req.session.user = req.body.username
        res.redirect('/home')
    }
    
    else{

        req.session.passswordwrong=true
        res.redirect('/')
    }

})

app.get('/home', (req, res)=>{
    if(req.session.user){
        res.render('home')
    }else{
        if(req.session.passswordwrong){
            req.session.passswordwrong = false
            res.render('login',{msg:"Invalid Username or Password"})
           
        }else{
            res.render('login')
        }
        
    }
})


app.get('/logout', (req,res)=>{

    req.session.destroy()
    
    res.render('login', {msg:"Logged Out"})
})







app.listen(7070, () => console.log("Server running on port 7070"));
