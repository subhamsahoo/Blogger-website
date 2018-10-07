const express = require('express');
const router = express.Router();
const post = require('../../models/Post');
const contact = require('../../models/contact');
const {superAuthenticated} = require('../../helpers/superAuthentication');

router.all('/*',superAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'superAdmin';
    next();
});


router.get('/', (req, res) => {
    post.find({status:'public'})
        .populate('category')
        .then(posts=>{
            res.render('superAdmin',{posts: posts});
        });
});

router.delete('/:id',(req,res)=>{
    post.findOne({_id: req.params.id})
        .populate('comments')
        .then(post=>{

            if(!post.comments.length<1){
                post.comments.forEach(comment=>{
                    comment.remove();
                });
            }

            post.remove().then(postRemoved=>{
                req.flash('success_message',`Post was deleted successfully`);
                res.redirect('/super/admin');
            });
        }).catch(err=>console.log(err));
});


router.get('/messages', (req, res) => {
    contact.find({})
        .then(messages=>{
            res.render('superAdmin/messages',{messages: messages});
        });
});



module.exports = router;
