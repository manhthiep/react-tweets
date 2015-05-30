/** @jsx React.DOM */

var React = require('react');

module.exports = NotificationBar = React.createClass({
  render: function(){
    var count = this.props.count;
    if (count > 0) {
    	// clear previous count (if any)
    	var document_title = document.title.replace(/\(.*?\)/g, '');
	    document_title = document_title.replace('(', '');
	    document_title = document_title.replace(') ', '');
	    // set new count
    	document.title = '(' + count + ') ' + document_title;
    }
    return (
      <div className={"notification-bar" + (count > 0 ? ' active' : '')}>
        <p>There are {count} new tweets! <a href="#top" onClick={this.props.onShowNewTweets}>Click here to see</a></p>
      </div>
    )
  }
});