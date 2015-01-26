'use strict';

module.exports = function (nextProps, nextState) {
  return nextState.hasError !== this.state.hasError ||
    nextProps.value !== this.props.value ||
    nextProps.options !== this.props.options ||
    nextProps.ctx.report.type !== this.props.ctx.report.type ||
    nextProps.onChange !== this.props.onChange;
};