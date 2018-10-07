const express = require('express');
const router = express.Router();
const post = require('../../models/Post');
const category = require('../../models/category');
const {isEmpty} = require('../../helpers/upload-helper');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/my-posts',(req,res)=>{

    post.find({user:req.user.id})
        .populate('category')
        .then(posts=>{
            res.render('admin/posts/my-posts',{posts: posts});
        });

});


router.get('/create', (req, res) => {

    category.find({}).then(categories=>{
        res.render('admin/posts/create',{categories:categories});
    });

});


router.post('/create', (req, res) => {


    let errors = [];


    if(!req.body.title) {

        errors.push({message: 'please add a title'});

    }


    if(!req.body.body) {

        errors.push({message: 'please add a description'});

    }


    if(errors.length > 0){

        res.render('admin/posts/create', {

            errors: errors

        })

    } else {

        let data = '';
        let type = '';

        if (!isEmpty(req.files)) {

            let file = req.files.file;
            data = file.data;
            type = file.mimetype;

        }


        let comments = false;
        if (req.body.allowComments)
            comments = true;

        const newPost = new post();
            newPost.user=req.user.id;
            newPost.title= req.body.title;
            newPost.status= req.body.status;
            newPost.allowComments= comments;
            newPost.body= req.body.body;
            newPost.category= req.body.category;
            newPost.img.data = data.toString('base64');
            newPost.img.contentType = type;

        newPost.save().then(savedPost => {
            console.log(savedPost);
            req.flash('success_message',`Post ${savedPost.title} was created successfully`);
            res.redirect('/admin/posts/my-posts');
        }).catch(err => {
            console.log(`Error saving the data ${err}`);
        });

    }
});

router.get('/edit/:id',(req,res)=>{
    post.findOne({_id: req.params.id}).then(post=>{
        category.find({}).then(categories=>{
            res.render('admin/posts/edit',{post:post,categories:categories});
        });

    }).catch(err=>console.log(err));
});

router.put('/edit/:id',(req,res)=>{
    post.findOne({_id: req.params.id}).then(post=>{
        let comments = false;
        if (req.body.allowComments)
            comments = true;

            post.user=req.user.id;
            post.title=req.body.title;
            post.status=req.body.status;
            post.allowComments=comments;
            post.category=req.body.category;
            post.body=req.body.body;

        if (!isEmpty(req.files)) {

            let file = req.files.file;
            post.img.data = file.data.toString('base64');
            post.img.contentType = file.mimetype;


        }

            post.save().then(updatedPost=>{
                console.log(updatedPost);
                req.flash('success_message',`Post was updated successfully`);
                res.redirect('/admin/posts/my-posts');
            }).catch(err => {
                console.log(`Error saving the data ${err}`);
            });
    }).catch(err=>console.log(err));

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
                  res.redirect('/admin/posts/my-posts');
              });
        }).catch(err=>console.log(err));
});

module.exports = router;