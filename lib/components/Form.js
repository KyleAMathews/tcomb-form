'use strict';

var React = require('react');
var debug = require('debug')('lib/components/Form');
var getComponent = require('./getComponent');

function noop() {}

var Form = React.createClass({

  displayName: 'Form',

  getInitialState: function () {
    debug('getInitialState() props: %j', this.props);
    return null;
  },

  // the public api returns `null` if validation failed
  // unless the optional boolean argument `raw` is set to `true`
  getValue: function (raw) {
    var result = this.refs.input.getValue();
    if (raw === true) { return result; }
    if (result.isValid()) { return result.value; }
    return null;
  },

  render: function () {
    var type = this.props.type;
    var options = this.props.options || {};
    var factory = React.createFactory(getComponent(type, options));
    return factory({
      ref: 'input',
      type: type,
      options: options,
      value: this.props.value,
      onChange: this.props.onChange || noop
    });
  }

});

module.exports = Form;