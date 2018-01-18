var User = require('../models/user.js');

exports.showSignup = function(req, res) {
    res.render('signup', { // 调用当前路径下的 list.jade 模板
        title: '注册页面'
    })
}
exports.showSignin = function(req, res) {
    res.render('signin', { // 调用当前路径下的 list.jade 模板
        title: '登陆页面'
    })
}

exports.signup = function(req, res) {
    var _user = req.body.user;
    console.log(req.body.user);
    User.findOne({ name: _user.name }, function(err, user) {
        if (err) { console.log(err); }
        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) { console.log(err); }
                res.redirect('/');
            })
        }
    })
}
//usrlist page
exports.list = function(req, res) {
        User.fetch(function(err, users) {
            res.render('userlist', { // 调用当前路径下的 list.jade 模板
                title: '用户列表页',
                users: users
            })
        })
}

// signin page
exports.signin = function(req, res) {
    var _user = req.body.user
    var name = _user.name;
    var password = _user.password
    User.findOne({ name: name }, function(err, user) {
        if (err) { console.log(err); }
        if (!user) {
            return res.redirect('/signup');
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) { console.log(err); }
            if (isMatch) {
                // console.log(user);
                // console.log(req.session);
                req.session.user = user;
                return res.redirect('/');
            } else {
                return res.redirect('/signin');
                console.log('密码错误!');
            }
        })
    })
}

// logout
exports.logout = function(req, res) {
    delete req.session.user;
    delete res.locals.user;
    return res.redirect('/');

}

// user signin_required
exports.signinRequired = function(req, res,next) {
        var user = req.session.user;    
        if (!user) {
            return res.redirect('/signin');
        }
        next();
}

// user admin_required
exports.adminRequired = function(req, res,next) {
        var user = req.session.user;

        if (!user.role||user.role<=10) {
            return res.redirect('/signin');
        }
        next();
}

