var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
// index page
exports.index = function(req, res) {
  var _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  Catetory.find({}).populate({
    path: 'movies',
    options: {
      limit: 5
    }
  }).exec(function(err, catetories) {
    res.render('index', { // 调用当前路径下的 test.jade 模板
      title: 'IKanMovie',
      catetories: catetories
    })
  })
}
// search page
exports.search = function(req, res) {
  var catId = req.query.cat;
  var q = req.query.q;
  var page = parseInt(req.query.p) || 0 ;
  var count = 3;
  var index = page * count;

  if (catId) {
    Catetory
    .find({_id: catId})
    .populate({path: 'movies'})
    .exec(function(err, catetories) {
      var catetory = catetories[0] || {};
      var movies = catetory.movies || [];
      var results = movies.slice(index, index + count);
      res.render('results', { //
        title: '分类结果列表页面',
        keyword: catetory.name,
        query: 'cat=' + catId,
        currentPage: (page + 1),
        totalPage: Math.ceil(movies.length / count),
        movies: results
      })
    })
  }else {
    Movie
    .find({title:new RegExp(q+'.*','i')})
    .populate({path: 'movies'})
    .exec(function(err, movies) {
      var results = movies.slice(index, index + count);
      res.render('results', { //
        title: '分类结果列表页面',
        keyword: q,
        query: 'q=' + q,
        currentPage: (page + 1),
        totalPage: Math.ceil(movies.length / count),
        movies: results
      })
    })
  }
}
