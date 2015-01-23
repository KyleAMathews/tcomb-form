'use strict';

var React = require('react');
var t = require('tcomb-validation');
var debug = require('debug')('lib/components/List');
var getComponent = require('./getComponent');
var move = require('../util/move');
var merge = require('../util/merge');
var uuid = require('../util/uuid');

var List = React.createClass({

  displayName: 'List',

  getInitialState: function () {
    debug('getInitialState() props: %j', this.props);
    var value = this.props.value || [];
    return {
      hasError: false,
      value: value,
      keys: value.map(uuid)
    };
  },

  // lists are uncontrolled: no componentWillReceiveProps
  componentWillReceiveProps: function (props) {
    debug('componentWillReceiveProps() props: %j', props);
    this.setState({
      hasError: false,
      value: props.value || []
    });
  },

  onChange: function (value, keys) {
    debug('onChange() value changed from %j to %j', this.state.value, value);
    this.setState({hasError: false, value: value, keys: keys || this.state.keys}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  getValue: function () {
    var value = [];
    var errors = [];
    var hasError = false;
    var result;

    for (var i = 0, len = this.state.value.length ; i < len ; i++ ) {
      result = this.refs[i].getValue();
      errors = errors.concat(result.errors);
      value.push(result.value);
    }

    this.setState({hasError: hasError, value: value});
    return new t.ValidationResult({errors: errors, value: value});
  },

  addItem: function (evt) {
    evt.preventDefault();
    var value = this.state.value.concat(null);
    var keys = this.state.keys.concat(uuid());
    this.onChange(value, keys);
  },

  onItemChange: function (itemIndex, itemValue) {
    var value = this.state.value.slice();
    value[itemIndex] = itemValue;
    this.onChange(value);
  },

  removeItem: function (i, evt) {
    evt.preventDefault();
    var value = this.state.value.slice();
    value.splice(i, 1);
    var keys = this.state.keys.slice();
    keys.splice(i, 1);
    this.onChange(value, keys);
  },

  moveUpItem: function (i, evt) {
    evt.preventDefault();
    if (i > 0) {
      this.onChange(
        move(this.state.value.slice(), i, i - 1),
        move(this.state.keys.slice(), i, i - 1)
      );
    }
  },

  moveDownItem: function (i, evt) {
    evt.preventDefault();
    if (i < this.state.value.length - 1) {
      this.onChange(
        move(this.state.value.slice(), i, i + 1),
        move(this.state.keys.slice(), i, i + 1)
      );
    }
  },

  render: function () {
    var type = this.props.type;
    var options = this.props.options;
    var itemType = type.meta.type;
    var itemOptions = options.item || {};
    var factory = React.createFactory(getComponent(itemType, itemOptions));
    var components = this.state.value.map(function (value, i) {
      return (
        React.createElement('div', {className: 'row', key: i /*this.state.keys[i]*/},
          React.createElement('div', {className: 'col-md-6'},
            factory({
              ref: i,
              type: itemType,
              options: itemOptions,
              value: value,
              onChange: this.onItemChange.bind(this, i),
            })
          ),
          React.createElement('div', {className: 'col-md-6'},
            React.createElement('button', {onClick: this.removeItem.bind(this, i), className: 'btn btn-default'}, 'Remove'),
            React.createElement('button', {onClick: this.moveUpItem.bind(this, i), className: 'btn btn-default'}, 'Up'),
            React.createElement('button', {onClick: this.moveDownItem.bind(this, i), className: 'btn btn-default'}, 'Down')
          )
        )
      );
    }.bind(this));

    return (
      React.createElement('fieldset', null,
        components,
        React.createElement('div', {className: 'form-group'},
          React.createElement('button', {onClick: this.addItem, className: 'btn btn-default'}, 'Add')
        )
      )
    );
  }

});

module.exports = List;