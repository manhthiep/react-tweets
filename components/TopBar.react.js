/** @jsx React.DOM */

var React = require('react');

module.exports = TopBar = React.createClass({
  render: function(){
    return (
      <div className="top-bar"><h3 className="title">Tweets</h3></div>
    )
  }
});