"use strict";

exports.__esModule = true;
exports.useErrorHandler = useErrorHandler;
exports.ErrorBoundary = void 0;

var _vue = require("vue");

var ErrorBoundary = (0, _vue.defineComponent)({
  name: 'ErrorBoundary',
  emits: {
    reset: function reset() {
      return true;
    },
    error: function error() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args) return true;
    }
  },
  setup: function setup(_, _ref) {
    var slots = _ref.slots,
        emit = _ref.emit;
    // state
    var error = (0, _vue.ref)(null); // methods

    var resetErrorBoundary = function resetErrorBoundary() {
      emit('reset');
      error.value = null;
    }; // hooks


    (0, _vue.onErrorCaptured)(function (err, instance, info) {
      emit('error', err, instance, info);
      error.value = err;
      return false;
    });
    return function () {
      if ((0, _vue.unref)(error)) {
        return (0, _vue.renderSlot)(slots, 'fallback', {
          resetErrorBoundary: resetErrorBoundary,
          error: (0, _vue.unref)(error)
        });
      }

      return slots["default"] == null ? void 0 : slots["default"]();
    };
  }
});
exports.ErrorBoundary = ErrorBoundary;

function useErrorHandler(givenError) {
  var error = (0, _vue.ref)(null);
  (0, _vue.watchEffect)(function () {
    if ((0, _vue.unref)(givenError)) throw (0, _vue.unref)(givenError);
    if ((0, _vue.unref)(error)) throw (0, _vue.unref)(error);
  });
  return function (args) {
    error.value = args;
  };
}