module.exports ={

    superAuthenticated: function (req,res,next) {
        if(req.isAuthenticated()&&req.user.email==='superadmin@blogger.com')
        {
            return next();
        }
        res.redirect('/');

    }
};