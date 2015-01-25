'use strict';

module.exports = function (nextProps, nextState) {
  return nextState.hasError !== this.state.hasError ||
    nextProps.value !== this.props.value ||
    nextProps.options !== this.props.options ||
    nextProps.type !== this.props.type ||
    nextProps.onChange !== this.props.onChange;
};