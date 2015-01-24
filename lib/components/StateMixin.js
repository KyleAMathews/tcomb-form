'use strict';

var t = require('tcomb-validation');
var shouldComponentUpdate = require('./shouldComponentUpdate');

module.exports = {

  getInitialState: function () {
    return {
      hasError: false,
      value: this.props.value
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: props.value});
  },

  shouldComponentUpdate: shouldComponentUpdate,

  onChange: function (value) {
    this.setState({value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var result = t.validate(this.state.value, this.props.ctx.report.type);
    this.setState({hasError: !result.isValid()});
    return result;
  }

};