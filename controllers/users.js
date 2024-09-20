const User = require("../models/user");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs")
}


module.exports.signUp = async(req,res)=>{
    try{
      const {username,email,password} = req.body;
      const newUser = new User({email,username});
      const registerUser = await  User.register(newUser,password);
      // console.log(registerUser);
      req.login(registerUser,(err)=>{
        if(err){
          return next();
        }
        req.flash("success","welcome to Wanderlust!");
        res.redirect("/listings")
      });
    } 
    catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
    }

 }


 module.exports.renderLogInForm = (req,res)=>{
    res.render("users/login.ejs");
   }

   module.exports.login = async(req,res)=>{
    let redirectUrl = res.locals.redirectUrl || "/listings"
     req.flash("success","welcome back to wanderlust!");
     res.redirect(redirectUrl);
 }


 module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if(err)
      {
       return  next(err);
      }
      req.flash("success","successfully you are logout!")
      res.redirect("/listings")
    })
   }