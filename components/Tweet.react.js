/** @jsx React.DOM */

var React = require('react');
var Autolinker = require('autolinker');

module.exports = Tweet = React.createClass({
  render: function(){
    var tweet = this.props.tweet;
    var tweet_body = Autolinker.link(tweet.body, { hashtag:'twitter', truncate: 60 });
    if (tweet.photos && tweet.photos.length > 0) {
      return (
        <li className={"tweet" + (tweet.active ? ' active' : '')}>
          <img src={tweet.avatar} className="avatar"/>
          <blockquote>
            <cite>
              <a href={"http://www.twitter.com/" + tweet.screenname} target='_blank'>{tweet.author}</a> 
              <span className="screen-name">@{tweet.screenname}</span> 
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
              <a href={"http://www.twitter.com/" + tweet.screenname} target='_blank'>{tweet.author}</a> 
              <span className="screen-name">@{tweet.screenname}</span> 
            </cite>
            <span className="content" dangerouslySetInnerHTML={{__html: tweet_body}}></span>
          </blockquote>
        </li>
      )
    }
  }
});