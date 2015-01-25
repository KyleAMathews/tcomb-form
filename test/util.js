var t = require('../.');
var config = require('../lib/config');
var getReport = require('../lib/util/getReport');
var Context = require('../lib/api').Context;

function getContext(ctx) {
  return new Context(t.util.mixin({
    templates: config.templates,
    i18n: config.i18n,
    report: getReport(ctx.type),
    name: 'defaultName',
    auto: 'placeholders',
    label: 'defaultLabel'
  }, ctx, true));
}

function getLocalsFactory(factory) {
  return function getLocals(ctx, options, value, onChange) {
    var x = new factory.type();
    x.props = {
      ctx: getContext(ctx),
      options: options,
      value: value,
      onChange: onChange
    };
    x.state = x.getInitialState();
    return x.getLocals();
  };
}


module.exports = {
  getLocalsFactory: getLocalsFactory
};