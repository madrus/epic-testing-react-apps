// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import { act, render } from '@testing-library/react'
import useCounter from '../../components/use-counter'

function setup(...args) {
  const returnVal = {}

  function TestComponent() {
    Object.assign(returnVal, useCounter(...args))
    return null
  }

  render(<TestComponent />)
  return returnVal
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
	const counter = setup()
  // screen.debug()
	console.log(counter)

	expect(counter.count).toBe(0)

	// `act` is necessary here because we are calling an `increment` function
	// that modifies the internal state of the SUT component

	await act(async () => {
		await counter.increment()
	})
	console.log(counter)

	expect(counter.count).toBe(1)

	await act(async () => {
		await counter.decrement()
	})
	console.log(counter)

	expect(counter.count).toBe(0)
})

test('exposes the count as equal to its initialValue = 10', async () => {
  // 🐨 render the component
	const counter = setup({initialCount: 10})
  // screen.debug()

	expect(counter.count).toBe(10)
})

test('increments and decrements with the custom step = 10', async () => {
  // 🐨 render the component
	const counter = setup({step: 10})
  // screen.debug()

	await act(async () => {
		await counter.increment()
	})

	expect(counter.count).toBe(10)

	await act(async () => {
		await counter.decrement()
	})

	expect(counter.count).toBe(0)
})

// eslint no-unused-vars:0
