var express = require('express');
var router = express.Router();

router.get('/', authentication ,function(req,res){
    res.render('index');
});

function authentication(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = router;