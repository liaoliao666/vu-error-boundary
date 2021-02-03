<div align="center">
<h1>vu-error-boundary</h1>

<p>Simple reusable Vue error boundary component</p>
</div>

## This solution

This component provides a simple and reusable wrapper that you can use to wrap
around your components. Any rendering errors in your components hierarchy can
then be gracefully handled.


## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [`ErrorBoundary` props](#errorboundary-props)
  - [`useErrorHandler(error?: Error)`](#useerrorhandlererror-error)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:


```bash
$ npm i vu-error-boundary
# or
$ yarn add vu-error-boundary
```

## Usage

The simplest way to use `<ErrorBoundary>` is to wrap it around any component
that may throw an error. This will handle errors thrown by that component and
its descendants too.

```vue
<script>
import {ErrorBoundary} from 'vu-error-boundary'
</script>

<template>
  <ErrorBoundary @reset="reset">
    <ComponentThatMayError />
    <template #fallback="{ resetErrorBoundary, error }">
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{{ error.message }}</pre>
        <button @click="resetErrorBoundary">Try again</button>
      </div>
    </template>
  </ErrorBoundary>
</template>
```

You can vue to errors (e.g. for logging) by providing an `@error` callback:

```vue
<script>
import {ErrorBoundary} from 'vu-error-boundary'

export default {
  setup() {
    const handleError = useErrorHandler()

    const myErrorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
      // Do something with the error
      // E.g. log to an error logging client here
    }

    return {
     myErrorHandler
    }
  },
}
</script>

<template>
  <ErrorBoundary @error="myErrorHandler">
    <ComponentThatMayError />
</template>
```

## API

### `ErrorBoundary` props

#### `children`

This is what you want rendered when everything's working fine. If there's an
error that Vue can handle within the children of the `ErrorBoundary`, the
`ErrorBoundary` will catch that and allow you to handle it gracefully.

#### `FallbackComponent`

This is a component you want rendered in the event of an error. As props it will
be passed the `error` and `resetErrorBoundary` (which will reset the error
boundary's state when called, useful for a "try again" button when used in
combination with the `onReset` prop).

This is required if no `fallback` or `fallbackRender` prop is provided.

#### `onError`

This will be called when there's been an error that the `ErrorBoundary` has
handled. It will be called with two arguments: `error`, `info`.

#### `onReset`

This will be called immediately before the `ErrorBoundary` resets it's internal
state (which will result in rendering the `children` again). You should use this
to ensure that re-rendering the children will not result in a repeat of the same
error happening again.

`onReset` will be called with whatever `resetErrorBoundary` is called with.

**Important**: `onReset` will _not_ be called when reset happens from a change
in `resetKeys`. Use `onResetKeysChange` for that.

### `useErrorHandler(error?: Error)`

Vue's `onErrorCaptured` feature is limited in that the boundaries can only
handle errors thrown during Vue's lifecycles. To quote

> Error boundaries do not catch errors for:
>
> - Event handlers
> - Asynchronous code (e.g. setTimeout or requestAnimationFrame callbacks)
> - Server side rendering
> - Errors thrown in the error boundary itself (rather than its children)

This means you have to handle those errors yourself, but you probably would like
to reuse the error boundaries you worked hard on creating for those kinds of
errors as well. This is what `useErrorHandler` is for.

There are two ways to use `useErrorHandler`:

1. `const handleError = useErrorHandler()`: call `handleError(theError)`
2. `useErrorHandler(error)`: useful if you are managing the error state yourself
   or get it from another hook.

Here's an example:

```vue
<script>
export default {
  setup() {
    const handleError = useErrorHandler()

    function handleSubmit(event) {
      event.preventDefault()
      const name = event.target.elements.name.value
      fetchGreeting(name).then(
        newGreeting => setGreeting(newGreeting),
        handleError,
      )
    }

    return {
     handleSubmit
    }
  },
}
</script>

<template>
  <div v-if="greeting">{{greeting}}</div>
  <form v-else @submit="handleSubmit">
    <label>Name</label>
    <input id="name" />
    <button type="submit">get a greeting</button>
  </form>
</template>
```

> Note, in case it's not clear what's happening here, you could also write
> `handleSubmit` like this:

```javascript
function handleSubmit(event) {
  event.preventDefault()
  const name = event.target.elements.name.value
  fetchGreeting(name).then(
    newGreeting => setGreeting(newGreeting),
    error => handleError(error),
  )
}
```

Alternatively, let's say you're using a hook that gives you the error:

```vue
<script>
export default {
  setup() {
    const name = ref('')
    const {greeting, error} = useGreeting(name)
    useErrorHandler(error)

    function handleSubmit(event) {
      event.preventDefault()
      name.value = event.target.elements.name.value
    }

    return {
     handleSubmit
    }
  },
}
</script>

<template>
  <div v-if="greeting">{{greeting}}</div>
  <form v-else @submit="handleSubmit">
    <label>Name</label>
    <input id="name" />
    <button type="submit">get a greeting</button>
  </form>
</template>
```

In this case, if the `error` is ever set to a truthy value, then it will be
propagated to the nearest error boundary.

In either case, you could handle those errors like this:

```vue
<template>
   <ErrorBoundary>
    <Greeting />
    <template #fallback="{ resetErrorBoundary, error }">
     ...
  </ErrorBoundary>
</template>
```

And now that'll handle your runtime errors as well as the async errors in the
`fetchGreeting` or `useGreeting` code.

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

## LICENSE

MIT