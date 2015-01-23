'use strict';

var React = require('react');
var t = require('tcomb-validation');
var debug = require('debug')('lib/components/Struct');
var getComponent = require('./getComponent');

var Struct = React.createClass({

  displayName: 'Struct',

  getInitialState: function () {
    debug('getInitialState() props: %j', this.props);
    return {
      hasError: false,
      value: this.props.value || {}
    };
  },

  componentWillReceiveProps: function (props) {
    debug('componentWillReceiveProps() props: %j', props);
    this.setState({
      hasError: false,
      value: props.value || {}
    });
  },

  onChange: function (value) {
    debug('onChange() value: %j', value);
    this.setState({hasError: false, value: value}, function () {
      this.props.onChange(value);
    }.bind(this));
  },

  onFieldChange: function (fieldName, fieldValue) {
    var value = t.util.mixin({}, this.state.value);
    value[fieldName] = fieldValue;
    this.onChange(value);
  },

  getValue: function () {

    var value = {};
    var errors = [];
    var hasError = false;
    var result;

    for (var ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        result = this.refs[ref].getValue();
        errors = errors.concat(result.errors);
        value[ref] = result.value;
      }
    }

    this.setState({hasError: hasError, value: value});
    return new t.ValidationResult({errors: errors, value: value});
  },

  render: function () {

    var type = this.props.type;
    var options = this.props.options || {};
    options.fields = options.fields || {};
    var props = type.meta.props;
    var order = options.order || Object.keys(props);
    var components = order.map(function (prop) {
      var propType = props[prop];
      var propOptions = options.fields[prop] || {};
      return React.createFactory(getComponent(propType, propOptions))({
        key: prop,
        ref: prop,
        type: propType,
        options: propOptions,
        value: this.state.value[prop],
        onChange: this.onFieldChange.bind(this, prop)
      })
    }.bind(this));

    return (
      React.createElement('fieldset', null, components)
    );
  }

});

module.exports = Struct;