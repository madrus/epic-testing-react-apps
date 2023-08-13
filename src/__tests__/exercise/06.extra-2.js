// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import { useCurrentPosition } from 'react-use-geolocation'
import userEvent from '@testing-library/user-event'
import Location from '../../examples/location'

jest.mock('react-use-geolocation')

beforeEach(() => {
  jest.resetAllMocks()
})

function setup(jsx) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

test('displays the users current location', () => {
  // 🐨 create a fakePosition object that has an object called "coords" with latitude and longitude
  // 📜 https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
  const fakePosition = {
    coords: {
      latitude: 52,
      longitude: 4,
    },
  }
  let setReturnValue
  function useMockCurrentPosition() {
    // our state is an array because useCurrentPosition returns an array
    const state = React.useState([])
    setReturnValue = state[1] // second element in state array is the setter
    return state[0] // first element in state array is the state value (i.e. position)
  }
  useCurrentPosition.mockImplementation(useMockCurrentPosition)

  // 🐨 now that setup is done, render the Location component itself
  setup(<Location />)

  // 🐨 verify the loading spinner is showing up
  // 💰 tip: try running screen.debug() to know what the DOM looks like at this point.
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setReturnValue([fakePosition])
  })
  // screen.debug()

  // 🐨 verify the loading spinner is no longer in the document
  //    (💰 use queryByLabelText instead of getByLabelText)
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  // 🐨 verify the latitude and longitude appear correctly
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )
})

test('displays the error message', () => {
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
  let setReturnValue
  function useMockCurrentPosition() {
    // our state is an array because useCurrentPosition returns an array
    const state = React.useState([])
    setReturnValue = state[1] // second element in state array is the setter
    return [null, fakeError]
  }
  useCurrentPosition.mockImplementation(useMockCurrentPosition)

  setup(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setReturnValue([fakePosition])
  })

  // screen.debug()

  expect(screen.queryByRole('alert')).toHaveTextContent(fakeError.message)
})

// eslint
//  	no-unused-vars: "off"
