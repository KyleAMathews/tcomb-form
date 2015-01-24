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
var debug = require('debug')('Textbox');

function normalize(value) {
  return (t.Str.is(value) && value.trim() === '') ? null :
    !t.Nil.is(value) ? value :
    null;
}

var Textbox = React.createClass({

  displayName: 'Textbox',

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

    var opts = new api.Textbox(this.props.options || {});
    var ctx = this.props.ctx;
    var label = !t.Nil.is(opts.label) ? opts.label :
      ctx.auto === 'labels' ? ctx.getDefaultLabel() :
      null;
    var placeholder = null;
    if (!label && ctx.auto !== 'none') {
      // labels have higher priority
      placeholder = !t.Nil.is(opts.placeholder) ? opts.placeholder : ctx.getDefaultLabel();
    }
    var value = this.state.value;
    var error = getError(opts.error, value);
    if (transformer) {
      value = transformer.format(value);
    }
    var transformer = opts.transformer || config.transformers[t.util.getName(ctx.report.innerType)];
    var name = opts.name || ctx.name;
    debug('render', name);
    var template = opts.template || ctx.templates.textbox;

    return compile(template(new skin.Textbox({
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: error,
      hasError: this.state.hasError || error,
      help: opts.help,
      id: opts.id || this._rootNodeID || uuid(),
      label: label,
      name: name,
      onChange: function (value) {
        this.onChange(normalize(value));
      }.bind(this),
      placeholder: placeholder,
      type: opts.type || 'text',
      value: value
    })));

  }

});

module.exports = Textbox;