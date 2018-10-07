const express = require('express');
const router = express.Router();
const post = require('../../models/Post');
const comment = require('../../models/comment');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*',userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req,res)=>{

    comment.find({user: req.user.id}).populate('user')
        .then(comments=>{
        res.render('admin/comments',{comments:comments});
    }).catch(err=>console.log(err));

});

router.post('/',(req,res)=>{

    post.findOne({_id:req.body.id}).then(post=>{
        const newComment = new comment({
            user:req.user.id,
            body: req.body.body
        });

        post.comments.push(newComment);

        post.save().then(savedPost=>{

            newComment.save().then(savedComment=>{
                res.redirect(`/post/${post.id}`);
            }).catch(err=>console.log('Error in saving comment'+err));

        }).catch(err=>console.log('Error in saving post'+err));

    }).catch(err=>console.log('post not found'+err));
});

router.delete('/:id',(req,res)=>{

    comment.remove({_id:req.params.id}).then(deletedComment=>{
        post.findOneAndUpdate({comments: req.params.id},{$pull:{comments:req.params.id}},(err,data)=>{
            if(err) console.log(err);
            res.redirect('/admin/comments');
        });

    }).catch(err=>console.log(err));
});


router.post('/approve-comments',(req,res)=>{

    comment.findByIdAndUpdate(req.body.id,{$set: {approveComment:req.body.approveComment}},(err,result)=>{
        if(err) return err;
        res.send(result);
    });
});

module.exports = router;