var Tweet = require('../models/Tweet');
var util = require('util');

module.exports = function(stream, io){

  // When tweets get sent our way ...
  stream.on('data', function(data) {

    if (!data['id']) {
      return;
    }

    // console.log('\n');
    // console.log('Tweet:');
    // console.log(JSON.stringify(data));

    // Construct a new tweet object
    var tweet = {
      twid: data['id_str'],
      origin: JSON.stringify(data),
      active: false,
      author: data['user']['name'],
      screenname: data['user']['screen_name'],
      avatar: data['user']['profile_image_url'],
      body: data['text'],
      date: data['created_at'],
      photos: [],
      urls: [],
      hashtags: [],
      symbols: []
    };

    // https://dev.twitter.com/overview/api/entities-in-twitter-objects
    // console.log('Entities:');

    var tweet_media = data['entities']['media'];
    if (tweet_media && tweet_media.length > 0) {
      for (var i = 0; i < tweet_media.length; i++) {
        if (tweet_media[i]['type'] == 'photo') {
          // console.log("  Photo: " + tweet_media[i]['media_url']);
          tweet.body = tweet.body.replace(tweet_media[i]['url'], '');
          tweet.photos.push({
            url: tweet_media[i]['media_url']
          });
        }
      }
    }

    var tweet_urls = data['entities']['urls'];
    if (tweet_urls && tweet_urls.length > 0) {
      for (var i = 0; i < tweet_urls.length; i++) {
        // console.log("  URL: " + tweet_urls[i]['expanded_url']);
        tweet.body = tweet.body.replace(tweet_urls[i]['url'], tweet_urls[i]['expanded_url']);
        tweet.urls.push({
          url: tweet_urls[i]['url'],
          expanded_url: tweet_urls[i]['expanded_url']
        });
      }
    }

    var tweet_hashtags = data['entities']['hashtags'];
    if (tweet_hashtags && tweet_hashtags.length > 0) {
      for (var i = 0; i < tweet_hashtags.length; i++) {
        // console.log("  Hashtag: " + tweet_hashtags[i]['text']);
        tweet.hashtags.push({
          text: tweet_hashtags[i]['text'],
        });
      }
    }

    var tweet_symbols = data['entities']['symbols'];
    if (tweet_symbols && tweet_symbols.length > 0) {
      for (var i = 0; i < tweet_symbols.length; i++) {
        // console.log("  Symbol: " + tweet_symbols[i]['text']);
        tweet.symbols.push({
          text: tweet_symbols[i]['text'],
        });
      }
    }

    // Create a new model instance with our object
    var tweetEntry = new Tweet(tweet);

    // Save 'er to the database
    tweetEntry.save(function(err) {
      if (!err) {
        // If everything is cool, socket.io emits the tweet.
        io.emit('tweet', tweet);
      }
    });

  });

};