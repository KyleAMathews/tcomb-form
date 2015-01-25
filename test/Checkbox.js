var test = require('tape');
var React = require('react');
var t = require('../.');
var Checkbox = require('../lib/components/Checkbox');
var util = require('./util');

var getLocals = util.getLocalsFactory(Checkbox);

test('Checkbox', function (tape) {

  tape.test('disabled', function (tape) {
    tape.plan(3);
    tape.strictEqual(getLocals({type: t.Bool}).disabled, null, 'default disabled should be null');
    tape.strictEqual(getLocals({type: t.Bool}, {disabled: true}).disabled, true, 'should handle disabled = true');
    tape.strictEqual(getLocals({type: t.Bool}, {disabled: false}).disabled, false, 'should handle disabled = false');
  });

  tape.test('value', function (tape) {
    tape.plan(1);
    tape.strictEqual(getLocals({type: t.Bool}).value, false, 'default value should be false');
  });

  tape.test('hasError', function (tape) {
    tape.plan(2);
    tape.strictEqual(getLocals({type: t.Bool}).hasError, false, 'default hasError should be false');
    tape.strictEqual(getLocals({type: t.Bool}, {hasError: true}).hasError, true, 'should handle hasError option');
  });

});



