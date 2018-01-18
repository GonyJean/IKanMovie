var Movie = require('../models/movie.js');
var Comment = require('../models/comment');
var Catetory = require('../models/catetory');
var _ = require('underscore');

// detail page
exports.detail = function(req, res) {
  var id = req.params.id;
  Movie.findById(id, function(err, movie) {
    Comment.find({movie: id}).populate('from', 'name').populate('reply.from reply.to', 'name').exec(function(err, comments) {
      console.log(comments);
      res.render('detail', {
        title: movie.title,
        movie: movie,
        comments: comments
      })
    })
  })

}

// admin page
exports.new = function(req, res) {
  Catetory.find({}, function(err, categories) {
    res.render('admin', {
      title: '电影录入',
      movie: {},
      categories: categories
    })
  })
}
// admin update movie
exports.update = function(req, res) {
  var id = req.params.id;
  if (id) {

    Movie.findById(id, function(err, movie) {
      Catetory.find({}, function(err, categories) {
        res.render('admin', {
          title: '后台更新',
          movie: movie,
          categories: categories
        })

      })
    })
  }
}
// admin post movie
exports.save = function(req, res) {
  // console.log("%j",req.body.movie);
  const id = req.body.movie._id;
  const movieObj = req.body.movie;
  var _movie;
  if (id) {
    Movie.findById(id, function(err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' + movie._id);
      })
    })
  } else {
    _movie = new Movie(movieObj)
    var categoryId = movieObj.catetory;
    var categoryName = movieObj.categoryName;
    _movie.save(function(err, movie) {
      if (err) {
        console.log(err);
      }
      if (categoryId) {
        Catetory.findById(categoryId, function(err, category) {
          if (err) {
            console.log(err);
            return;
          }
          // console.log("%j",category);
          category.movies.push(_movie.id);
          category.save(function(err, category) {
            res.redirect('/movie/' + movie._id);
          });
        })
      } else if (categoryName) {
        var catetory = new Catetory({
          name: categoryName,
          movies: [movie._id]
        })
        catetory.save(function(err, category) {
          movie.catetory = catetory._id;
          movie.save(function(err, movie) {
            res.redirect('/movie/' + movie._id);
          })
        });
      }
    })
  }
}

//list page
exports.list = function(req, res) {
  Movie.fetch(function(err, movies) {
    res.render('list', { // 调用当前路径下的 list.jade 模板
      title: '爱看电影',
      movies: movies
    })
  })
}

// list delete movie

exports.del = function(req, res) {

  var id = req.query.id;
  if (id) {
    Movie.remove({
      _id: id
    }, function(err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({success: 1})
      }
    })
  }
}
