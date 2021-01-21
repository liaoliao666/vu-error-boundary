import {
  ComponentPublicInstance,
  defineComponent,
  onErrorCaptured,
  Ref,
  ref,
  renderSlot,
  unref,
  watchEffect,
} from 'vue'

export const ErrorBoundary = defineComponent({
  name: 'ErrorBoundary',
  emits: {
    reset: () => {
      return true
    },
    error: (...args: [unknown, ComponentPublicInstance | null, string]) => {
      if (args) return true
    },
  },
  setup(_, { slots, emit }) {
    // state
    const error = ref<unknown>(null)

    // methods
    const resetErrorBoundary = () => {
      emit('reset')
      error.value = null
    }

    // hooks
    onErrorCaptured((err, instance, info) => {
      emit('error', err, instance, info)
      error.value = err

      return false
    })

    return () => {
      if (unref(error)) {
        return renderSlot(slots, 'fallback', {
          resetErrorBoundary,
          error: unref(error),
        })
      }

      return slots.default?.()
    }
  },
})

export function useErrorHandler(
  givenError?: Ref<unknown>
): (args: unknown) => void {
  const error = ref<unknown>(null)

  watchEffect(() => {
    if (unref(givenError)) throw unref(givenError)
    if (unref(error)) throw unref(error)
  })

  return args => {
    error.value = args
  }
}
