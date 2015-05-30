
var tweets_list = [];
var tweets_unread_count = 0;
var tweets_skip = 0;

var state_paging = false;
var state_done = false;
var state_page = 0;

$(function() {

  // Initialize socket.io
  var socket = io.connect();

  // On tweet event emission...
  socket.on('tweet', function (data) {

      // Add a tweet to our queue
      addTweet(data);

  });

  // Attach scroll event to the window for infinity paging
  window.addEventListener('scroll', checkWindowScroll);

  setInterval(function() {
    updateDateTime();
  }, 30000); // 30 seconds

  getPage(0);
});

var updateDateTime = function () {
  var now_moment = moment();
  var yesterday_moment = moment().subtract(1, 'day');
  $(".date-time").each(function(){
    var utc_time = $(this).attr("data-date-time");
    if (utc_time && utc_time != "") {
      var local_time = moment.utc(utc_time).toDate();
      var local_moment = moment(local_time.toISOString());
      var days_diff = now_moment.diff(local_moment, 'days');
      if (days_diff >= 2) { // over 2 days
        $(this).html(local_moment.format('MMMM DD, hh:mm a'));
      } else if (days_diff == 1) {
        if (yesterday_moment.date() == local_moment.date()) {
          $(this).html('Yesterday, ' + local_moment.format('hh:mm a'));
        } else {
          $(this).html(local_moment.format('MMMM DD, hh:mm a'));
        }
      } else {
        $(this).html(local_moment.fromNow());
      }
    }
  });
}

var renderTweet = function(tweet, show) {
  var tweet_body = Autolinker.link(tweet.body, { hashtag:'twitter', truncate: 60 });
  var time_from_now = moment(tweet.date).fromNow();
  var tweetHtml = '';
  if (show) {
    tweetHtml += '' +
  '<li class="tweet active">';
  } else {
    tweetHtml += '' +
  '<li class="tweet">';
  }
  tweetHtml += '' +
    '<img src="' + tweet.avatar + '" class="avatar"/>' +
    '<blockquote>' +
      '<cite>' +
        '<a href="http://www.twitter.com/' + tweet.screenname + '" target="_blank">' + tweet.author + '</a>' +
        '<span class="screen-name">@' + tweet.screenname + '</span> ' +
        '<span class="separator"> - </span>' +
        '<span class="time-from-now">' +
          '<a href="https://www.twitter.com/' + tweet.screenname + '/status/' + tweet.twid + '" target="_blank">' +
            '<span class="date-time" data-date-time="' + tweet.date + '">' + time_from_now + '</span> <span>on Twitter</span>' +
          '</a>' +
        '</span>' +
      '</cite>' +
      '<span class="content">' + tweet_body + '</span>';
  if (tweet.photos && tweet.photos.length > 0) {
    tweetHtml += '' +
      '<img src="' + tweet.photos[0].url + '" class="photo"/>';
  }
  tweetHtml += '' +
    '</blockquote>' +
  '</li>';

  // Return the HTML
  return tweetHtml;
}

// Add a tweet to our timeline
var addTweet = function(tweet){

  // Add tweet to the beginning of the tweets array
  tweets_list.unshift(tweet);

  // Increment the unread count
  tweets_unread_count++;

  // Increment the skip count
  tweets_skip++;

  // Add tweet to beginning of list
  $('#tweets-list').prepend(renderTweet(tweet, false));

  refreshNotification(tweets_unread_count);
}

var refreshNotification = function(unread_count) {

  if (unread_count > 0) {

    // Clear previous count (if any)
    var document_title = document.title.replace(/\(.*?\)/g, '');
    document_title = document_title.replace('(', '');
    document_title = document_title.replace(') ', '');

    // Set new count
    document.title = '(' + unread_count + ') ' + document_title;

    $('#new-tweets-count').html('' + unread_count);

    // Show notification bar
    $('#notification-bar').addClass('active');

  } else {

    // Clear previous count (if any)
    var document_title = document.title.replace(/\(.*?\)/g, '');
    document_title = document_title.replace('(', '');
    document_title = document_title.replace(') ', '');
    document.title = document_title;

    $('#new-tweets-count').html('' + 0);

    // Hide notification bar
    $('#notification-bar').removeClass('active');

  }
}

// Get JSON from server by page
var getPage = function(page){

  // Show loader
  $('#tweets-loading').addClass('active');

  // Setup our ajax request
  var request = new XMLHttpRequest();
  request.open('GET', 'page/' + page + "/" + tweets_skip, true);
  request.onload = function() {

    // If everything is cool...
    if (request.status >= 200 && request.status < 400){

      // Load our next page
      loadPagedTweets(JSON.parse(request.responseText));

    } else {

      // Set state (Not paging, paging complete)
      state_paging = false;
      state_done = true;

      // Hide loader
      $('#tweets-loading').removeClass('active');

    }
  };

  // Fire!
  request.send();

}

// Show the unread tweets
var showNewTweets = function(){

  refreshNotification(0);

  // Mark all tweets active
  tweets_list.forEach(function(tweet){
    tweet.active = true;
  });

  // Show all tweet
  $('.tweet').each(function() {
    $(this).addClass('active');
  });

  // Reset unread count
  tweets_unread_count = 0;

}

// Load tweets fetched from the server
var loadPagedTweets = function(tweets){

  // If we still have tweets...
  if(tweets.length > 0) {

    // This app is so fast, I actually use a timeout for dramatic effect
    // Otherwise you'd never see our super sexy loader svg
    setTimeout(function(){

      // Push them onto the end of the current tweets array
      tweets.forEach(function(tweet){
        tweets_list.push(tweet);

        // Add tweet to end of list
        $('#tweets-list').append(renderTweet(tweet, true));

      });

      // Set state (Not paging, add tweets)
      state_paging = false;

      // Hide loader
      $('#tweets-loading').removeClass('active');

    }, 1000);

  } else {

    // Set state (Not paging, paging complete)
    state_done = true;
    state_paging = false;

  }
}

// Check if more tweets should be loaded, by scroll position
var checkWindowScroll = function(){

  // Get scroll pos & window data
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var s = (document.body.scrollTop || document.documentElement.scrollTop || 0);
  var scrolled = (h + s) > document.body.offsetHeight;

  // If scrolled enough, not currently paging and not complete...
  if(scrolled && !state_paging && !state_done) {

    // Set application state (Paging, Increment page)
    state_paging = true; 
    state_page++;

    // Get the next page of tweets from the server
    getPage(state_page);

  }
}
