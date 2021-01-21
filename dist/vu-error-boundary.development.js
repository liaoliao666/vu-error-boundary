(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VuErrorBoundary = {}, global.Vue));
}(this, (function (exports, vue) { 'use strict';

  var ErrorBoundary = vue.defineComponent({
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
      var error = vue.ref(null); // methods

      var resetErrorBoundary = function resetErrorBoundary() {
        emit('reset');
        error.value = null;
      }; // hooks


      vue.onErrorCaptured(function (err, instance, info) {
        emit('error', err, instance, info);
        error.value = err;
        return false;
      });
      return function () {
        if (vue.unref(error)) {
          return vue.renderSlot(slots, 'fallback', {
            resetErrorBoundary: resetErrorBoundary,
            error: vue.unref(error)
          });
        }

        return slots["default"] == null ? void 0 : slots["default"]();
      };
    }
  });
  function useErrorHandler(givenError) {
    var error = vue.ref(null);
    vue.watchEffect(function () {
      if (vue.unref(givenError)) throw vue.unref(givenError);
      if (vue.unref(error)) throw vue.unref(error);
    });
    return function (args) {
      error.value = args;
    };
  }

  exports.ErrorBoundary = ErrorBoundary;
  exports.useErrorHandler = useErrorHandler;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vu-error-boundary.development.js.map
