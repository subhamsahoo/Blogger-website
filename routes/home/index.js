const express = require('express');
const router = express.Router();
const post = require('../../models/Post');
const category = require('../../models/category');
const contact = require('../../models/contact');
const user = require('../../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'home';
    next();
});

//1

router.get('/',(req,res)=>{
    post.find({status:'public'}).then(posts=>{
        category.find({}).then(categories=>{
            res.render('home/index',{posts: posts,categories:categories});
        });
    });
});

//2
router.get('/categories/:id',(req,res)=>{
    post.find({status:'public',category:req.params.id}).then(posts=>{
        category.find({}).then(categories=>{
            res.render('home/index',{posts: posts,categories:categories});
        });
    });
});

//3
router.get('/post/:id',(req,res)=>{
    post.findOne({_id:req.params.id})
        .populate({path:'comments',match:{approveComment:true},populate:{path:'user',model:'users'}})
        .populate('user')
        .then(post=>{
            category.find({}).then(categories=> {
                res.render('home/post', {post: post,categories:categories});
            });
        }).catch(err=>console.log(err));
});


router.get('/about',(req,res)=>{
    res.render('home/about');
});


router.get('/login',(req,res)=>{
    res.render('home/login');
});


passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{

    user.findOne({email: email}).then(userFound=>{
        if(!userFound) return done(null, false, { message: 'Incorrect username.' });

        bcrypt.compare(password,userFound.password,(err,matched)=>{
            if(err) return err;
            if(matched)
                return done(null, userFound);
            else
                return done(null, false, { message: 'Incorrect password.' });

        });
    }).catch(err=>console.log(err));
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
        done(err, user);
    });
});



router.post('/login',(req,res,next)=>{

    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/contact',(req,res)=>{
    res.render('home/contact');
});

router.post('/contact',(req,res)=>{
    console.log('contact');
    const newContact = new contact({
        name: req.body.txtName,
        email: req.body.txtEmail,
        phone: req.body.txtPhone,
        message:req.body.txtMsg
    });

    newContact.save().then(savedContact=>{
        req.flash('success_message', 'Your message was send Successfully, We will contact you soon..');
        res.redirect('/contact');
    });
});

router.get('/register',(req,res)=>{
    res.render('home/register');
});

router.post('/register',(req,res)=>{

    let errors = [];


    if(!req.body.firstName) {

        errors.push({message: 'please enter your first name'});

    }


    if(!req.body.lastName) {

        errors.push({message: 'please add a last name'});

    }

    if(!req.body.email) {

        errors.push({message: 'please add an email'});

    }

    if(!req.body.password) {

        errors.push({message: 'please enter a password'});

    }


    if(!req.body.passwordConfirm) {

        errors.push({message: 'This field cannot be blank'});

    }


    if(req.body.password !== req.body.passwordConfirm) {

        errors.push({message: "Password fields don't match"});

    }


    if(errors.length > 0){

        res.render('home/register', {

            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        })

    } else {


        user.findOne({email: req.body.email}).then(userFound=>{

            if(!userFound){
                const newUser = new user({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,

                });

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        newUser.password = hash;
                        newUser.save().then(savedUser=>{
                            req.flash('success_message', 'You are now registered, please login')
                            res.redirect('/login');
                        });
                    })
                });
            } else {
                req.flash('error_message', 'That email exist please login');
                res.redirect('/login');
            }
        }).catch(err=>console.log(err));
    }
});

module.exports = router;