// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Location from '../../examples/location'

beforeAll(() => {
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  }
})

function setup(jsx) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

test('displays the error message', async () => {
  const fakePosition = {
    coords: {
      latitude: 52,
      longitude: 4,
    },
  }
  const errorMessage = 'Something went wrong!'
  const fakeError = {
    message: errorMessage,
  }

  // 🐨 create a deferred promise here
  const { promise, reject } = deferred()

  window.navigator.geolocation.getCurrentPosition.mockImplementation(
    (successCallback, errorCallback) => {
      promise.then(() => {
        console.log('promise resolved')
        successCallback(fakePosition)
      }).catch(() => {
        console.log('promise rejected')
        errorCallback(fakeError)
      })
    },
  )

  setup(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  await act(async () => {
    try {
      reject(fakeError)
      await promise
    } catch (e) {
      console.log('catch: ' + e.message)
    }
  })

  // screen.debug()

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.queryByRole('alert')).toHaveTextContent(fakeError.message)
})

// eslint
//  	no-unused-vars: "off"
