'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var merge = require('../util/merge');
var config = require('../config');
var compile = require('uvdom/react').compile;
var debug = require('debug')('Checkbox');

function normalize(value) {
  return !!t.maybe(t.Bool)(value);
}

var Checkbox = React.createClass({

  displayName: 'Checkbox',

  getInitialState: function () {
    return {
      hasError: false,
      value: normalize(this.props.value)
    };
  },

  componentWillReceiveProps: function (props) {
    this.setState({value: normalize(props.value)});
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
  },

  render: function () {

    var opts = new api.Checkbox(this.props.options || {});
    var ctx = this.props.ctx;
    // checkboxes must have a label
    var label = opts.label || ctx.getDefaultLabel();
    var name = opts.name || ctx.name;
    debug('render', name);
    var value = this.state.value;
    var error = getError(opts.error, value);
    var template = opts.template || ctx.templates.checkbox;

    return compile(template(new skin.Checkbox({
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: error,
      hasError: this.state.hasError || error,
      help: opts.help,
      id: opts.id || this._rootNodeID || uuid(),
      label: label,
      name: name,
      onChange: this.onChange,
      value: value
    })));
  }

});

module.exports = Checkbox;