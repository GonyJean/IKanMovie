var Movie = require('../models/movie.js');
var Comment = require('../models/comment');
var Catetory = require('../models/catetory');
var _ = require('underscore');

// catetory page
exports.new = function(req, res) {
    res.render('catetory_admin', {
        title: '后台分类录入',
        catetory:{}
    })
}
// catetory post 
exports.save = function(req, res) {
    // console.log(req.body.movie);
    var _catetory = req.body.catetory
    var catetory = new Catetory(_catetory)
    catetory.save(function(err, movie) {
        if (err) { console.log(err); }
        res.redirect('/admin/catetory/list');
    })


}

// catetory list

exports.list = function(req, res) {
        Catetory.fetch(function(err, catetories) {
            res.render('catetory_list', { // 调用当前路径下的 list.jade 模板
                title: '分类列表页',
                catetories: catetories
            })
        })
}