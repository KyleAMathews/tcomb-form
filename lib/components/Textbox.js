'use strict';

var React = require('react');
var t = require('tcomb-validation');
var debug = require('debug')('lib/components/Textbox');

function normalize(value) {
  return (t.Str.is(value) && value.trim() === '') ? null : value || null;
}

function getError(error, value) {
  return t.Func.is(error) ? error(value) : error;
}

var Textbox = React.createClass({

  displayName: 'Textbox',

  getInitialState: function () {
    debug('getInitialState() props: %j', this.props);
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    debug('componentWillReceiveProps() props: %j', props);
    var value = normalize(props.value);
    if (value !== this.state.value) {
      debug('  value changed from %j to %j', this.state.value, value);
      this.setState({
        hasError: false,
        value: value
      });
    }
  },

  onChange: function (value) {
    value = normalize(value);
    debug('onChange() value changed from %j to %j', this.state.value, value);
    this.setState({hasError: false, value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.type);
    var isValid = result.isValid();
    this.setState({hasError: !isValid});
    return result;
  },

  render: function () {

    var error = getError(this.props.options.error, this.state.value);
    var hasError = this.state.hasError || error;

    return (
      React.createElement('div', {className: 'form-group' + (hasError ? ' has-error': '')},
        React.createElement('input', {
          type: 'text',
          placeholder: this.props.options.placeholder,
          value: this.state.value,
          onChange: function (evt) {
            this.onChange(evt.target.value);
          }.bind(this),
          className: 'form-control'
        })
      )
    );
  }

});

module.exports = Textbox;