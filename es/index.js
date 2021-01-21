import { defineComponent, onErrorCaptured, ref, renderSlot, unref, watchEffect } from 'vue';
export var ErrorBoundary = defineComponent({
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
    var error = ref(null); // methods

    var resetErrorBoundary = function resetErrorBoundary() {
      emit('reset');
      error.value = null;
    }; // hooks


    onErrorCaptured(function (err, instance, info) {
      emit('error', err, instance, info);
      error.value = err;
      return false;
    });
    return function () {
      if (unref(error)) {
        return renderSlot(slots, 'fallback', {
          resetErrorBoundary: resetErrorBoundary,
          error: unref(error)
        });
      }

      return slots["default"] == null ? void 0 : slots["default"]();
    };
  }
});
export function useErrorHandler(givenError) {
  var error = ref(null);
  watchEffect(function () {
    if (unref(givenError)) throw unref(givenError);
    if (unref(error)) throw unref(error);
  });
  return function (args) {
    error.value = args;
  };
}