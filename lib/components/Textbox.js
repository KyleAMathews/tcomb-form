'use strict';

var React = require('react');
var t = require('tcomb-validation');
var debug = require('debug')('lib/components/Textbox');

var Textbox = React.createClass({

  displayName: 'Textbox',

  normalize: function (value) {
    // handle white spaces
    return (t.Str.is(value) && value.trim() === '') ? null : value;
  },

  getInitialState: function () {
    debug('getInitialState() props: %j', this.props);
    return {
      hasError: !!this.props.hasError,
      value: this.normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    debug('componentWillReceiveProps() props: %j', props);
    var value = this.normalize(props.value);
    if (value !== this.state.value) {
      debug('setState() %s %s', value, this.state.value);
      this.setState({
        hasError: false,
        value: value
      });
    }
  },

  onChange: function (value) {
    value = this.normalize(value);
    debug('onChange() value: %j', value);
    this.setState({hasError: false, value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.type);
    var isValid = result.isValid();
    if (!isValid) { debug('getValue() %j', result); }
    this.setState({
      hasError: !isValid,
      value: result.value
    });
    return result;
  },

  render: function () {
    return (
      React.createElement('div', {className: 'form-group' + (this.state.hasError ? ' has-error': '')},
        React.createElement('input', {
          type: 'text',
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