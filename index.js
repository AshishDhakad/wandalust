
if(process.env.NODE_ENV != "production")
{
    require('dotenv').config()
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')



const listingsRouter = require('./routes/listing.js')    // all listing file require 
const reviewsRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js');
const { log } = require('console');

const port = 8080;


const dbUrl = process.env.ATLASDB_URL;
  
main()
.then(()=>{
    console.log("connnected to db");
    
})
.catch( (err) =>{
    console.log(err);  
})

  async function main()
  {
     await mongoose.connect(dbUrl);
  } 

  app.set("view engine","ejs")
  app.set("views",path.join(__dirname,"views"));
  app.use(express.urlencoded({extended:true}));
  app.use(methodOverride("_method"));
  app.engine('ejs',ejsMate)
  app.use(express.static(path.join(__dirname,"/public")));
  

   const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
   })
    
   store.on('error', (err) => {
      console.log("ERROR ON  MONGO SESSION STORE", err);
   })

   const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
   };

   app.use(session(sessionOption));
   app.use(flash());
    
   
   app.use(passport.initialize());
   app.use(passport.session());
   passport.use(new LocalStrategy(User.authenticate()))

   passport.serializeUser(User.serializeUser());
   passport.deserializeUser(User.deserializeUser());


   /// store cookies in local storage
   app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
   })

   app.use('/listings',listingsRouter);
   app.use('/listings/:id/reviews',reviewsRouter);
   app.use('/',userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found !"))
})

 app.use((err,req,res,next)=>{

    let{statusCode=500,message="smothing went wrong"}=err;
    // res.status(statusCode).send(message);

    res.status(statusCode).render("error.ejs",{err,statusCode})
 })

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})