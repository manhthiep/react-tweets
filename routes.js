var Tweet = require('./models/Tweet');

module.exports = {

  index: function(req, res) {
    // Render our 'home' template
    res.render('home.ejs', {});
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {

      // Render as JSON
      res.send(tweets);

    });
  }

}