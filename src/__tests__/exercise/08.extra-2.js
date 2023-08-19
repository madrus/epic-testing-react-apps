// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import { act, render } from '@testing-library/react'
import useCounter from '../../components/use-counter'

function setup({ initialProps } = {}) {
  const result = {}

  function TestComponent() {
    result.current = useCounter(initialProps)
    return null
  }

  render(<TestComponent />)
  return result
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
  const result = setup()
  // console.log(counter)

  expect(result.current.count).toBe(0)

  // `act` is necessary here because we are calling an `increment` function
  // that modifies the internal state of the SUT component

  await act(async () => await result.current.increment())
  // console.log(counter)

  expect(result.current.count).toBe(1)

  await act(async () => await result.current.decrement())
  // console.log(counter)

  expect(result.current.count).toBe(0)
})

test('exposes the count as equal to its initialValue = 10', async () => {
  // 🐨 render the component
  const result = setup({ initialProps: { initialCount: 10 }})
  // console.log(counter)

  expect(result.current.count).toBe(10)
})

test('increments and decrements with the custom step = 10', async () => {
  // 🐨 render the component
  const result = setup({ initialProps: { step: 10 }})
  // screen.debug()

  await act(async () => await result.current.increment())

  expect(result.current.count).toBe(10)

  await act(async () => await result.current.decrement())
  expect(result.current.count).toBe(0)
})

// eslint no-unused-vars:0
