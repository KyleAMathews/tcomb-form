'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var shouldComponentUpdate = require('./shouldComponentUpdate');
var getError = require('../util/getError');
var merge = require('../util/merge');
var getOptionsOfEnum = require('../util/getOptionsOfEnum');
var compile = require('uvdom/react').compile;
var debug = require('debug')('Radio');

function normalize(value) {
  return api.SelectValue(value || '');
}

var Radio = React.createClass({

  displayName: 'Radio',

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

    var opts = new api.Radio(this.props.options || {});
    var ctx = this.props.ctx;

    var label = !t.Nil.is(opts.label) ? opts.label :
      ctx.auto === 'labels' ? ctx.getDefaultLabel() :
      null;
    var name = opts.name || ctx.name;
    debug('render', name);
    var value = this.state.value;
    var error = getError(opts.error, value);
    var options = opts.options ? opts.options.slice() : getOptionsOfEnum(ctx.report.innerType);
    // sort opts
    if (opts.order) {
      options.sort(api.Order.getComparator(opts.order));
    }
    var template = opts.template || ctx.templates.radio;

    return compile(template(new skin.Radio({
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: error,
      hasError: this.state.hasError || error,
      help: opts.help,
      id: opts.id || this._rootNodeID || uuid(),
      label: label,
      name: name,
      onChange: this.onChange,
      options: options,
      value: value
    })));
  }

});

module.exports = Radio;