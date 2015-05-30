/** @jsx React.DOM */

var React = require('react');
var Autolinker = require('autolinker');
var moment = require('moment');

module.exports = Tweet = React.createClass({
  render: function(){
    var tweet = this.props.tweet;
    var tweet_body = Autolinker.link(tweet.body, { hashtag:'twitter', truncate: 60 });
    var time_from_now = moment(tweet.date.toString()).fromNow();
    if (tweet.photos && tweet.photos.length > 0) {
      return (
        <li className={"tweet" + (tweet.active ? ' active' : '')}>
          <img src={tweet.avatar} className="avatar"/>
          <blockquote>
            <cite>
              <a href={"https://www.twitter.com/" + tweet.screenname} target="_blank">{tweet.author}</a> 
              <span className="screen-name">@{tweet.screenname}</span> 
              <span className="separator"> - </span>
              <span className="time-from-now">
                <a href={"https://www.twitter.com/" + tweet.screenname + "/status/" + tweet.twid} 
                  target="_blank">
                  <span className="date-time" data-date-time={"" + tweet.date}>{time_from_now}</span> <span>on Twitter</span>
                </a>
              </span>
            </cite>
            <span className="content" dangerouslySetInnerHTML={{__html: tweet_body}}></span>
            <img src={tweet.photos[0].url} className="photo"/>
          </blockquote>
        </li>
      )
    } else {
      return (
        <li className={"tweet" + (tweet.active ? ' active' : '')}>
          <img src={tweet.avatar} className="avatar"/>
          <blockquote>
            <cite>
              <a href={"https://www.twitter.com/" + tweet.screenname} target="_blank">{tweet.author}</a> 
              <span className="screen-name">@{tweet.screenname}</span>
              <span className="separator"> - </span>
              <span className="time-from-now">
                <a href={"https://www.twitter.com/" + tweet.screenname + "/status/" + tweet.twid} 
                  target="_blank">
                  <span className="date-time" data-date-time={"" + tweet.date}>{time_from_now}</span> <span>on Twitter</span>
                </a>
              </span>
            </cite>
            <span className="content" dangerouslySetInnerHTML={{__html: tweet_body}}></span>
          </blockquote>
        </li>
      )
    }
  }
});