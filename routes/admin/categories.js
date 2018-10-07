const express = require('express');
const router = express.Router();
const category = require('../../models/category');

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/',(req,res)=>{
    category.find({}).then(category=>{
        res.render('admin/categories',{category: category});
    });
});

router.post('/create',(req,res)=>{
    const newCategory = new category({
        name: req.body.name
    });

    newCategory.save().then(savedCategory=>{
        console.log(savedCategory);
        res.redirect('/admin/categories');
    }).catch(err=>console.log(err));
});



router.get('/edit/:id',(req,res)=>{
    category.findOne({_id:req.params.id}).then(category=>{
        res.render('admin/categories/edit',{category: category});
    });
});

router.put('/edit/:id',(req,res)=>{
    category.findOne({_id: req.params.id}).then(category=>{
        category.name=req.body.name;

        category.save().then(updatedCategory=>{
            console.log(updatedCategory);
            res.redirect('/admin/categories');
        }).catch(err => {
            console.log(`Error saving the data ${err}`);
        });
    }).catch(err=>console.log(err));

});



// router.delete('/:id',(req,res)=>{
//     category.remove({_id: req.params.id})
//         .then(result=>{
//             res.redirect('/admin/categories');
//         }).catch(err=>console.log(err));
// });

module.exports = router;