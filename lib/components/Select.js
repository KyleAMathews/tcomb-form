'use strict';

var React = require('react');
var t = require('tcomb-validation');
var api = require('../api');
var skin = require('../skin');
var StateMixin = require('./StateMixin');
var getError = require('../util/getError');
var merge = require('../util/merge');
var getOptionsOfEnum = require('../util/getOptionsOfEnum');
var compile = require('uvdom/react').compile;
var debug = require('debug')('Select');

function normalize(value) {
  return (t.Str.is(value) && value.trim() === '') ? null : value || null;
}

var Select = React.createClass({

  displayName: 'Select',

  mixins: [StateMixin],

  render: function () {

    var opts = new api.Select(this.props.options || {});
    var ctx = this.props.ctx;

    var Enum = ctx.report.innerType;
    // handle `multiple` attribute
    var multiple = false;
    if (Enum.meta.kind === 'list') {
      multiple = true;
      Enum = getReport(Enum.meta.type).innerType;
    }
    var label = !t.Nil.is(opts.label) ? opts.label :
      ctx.auto === 'labels' ? ctx.getDefaultLabel() :
      null;
    var name = opts.name || ctx.name;
    debug('render', name);
    var value = this.state.value;
    var error = getError(opts.error, value);
    var options = opts.options ? opts.options.slice() : getOptionsOfEnum(Enum);
    // sort opts
    if (opts.order) {
      options.sort(api.Order.getComparator(opts.order));
    }
    // add a `null` option in first position
    var nullOption = opts.nullOption || {value: '', text: '-'};
    if (!multiple) {
      options.unshift(nullOption);
    }
    var template = opts.template || ctx.templates.select;

    return compile(template(new skin.Select({
      autoFocus: opts.autoFocus,
      config: merge(ctx.config, opts.config),
      disabled: opts.disabled,
      error: error,
      hasError: this.state.hasError || error,
      help: opts.help,
      id: opts.id || this._rootNodeID || uuid(),
      label: label,
      name: name,
      multiple: multiple,
      onChange: this.onChange,
      options: options,
      value: value
    })));

  }

});

module.exports = Select;