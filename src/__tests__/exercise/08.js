// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

function setup(jsx) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

// 🐨 create a simple function component that uses the useCounter hook
// and then exposes some UI that our test can interact with to test the
// capabilities of this hook
// 💰 here's how to use the hook:
// const {count, increment, decrement} = useCounter()
function UseCounterHookExample({ initialCount = 0, step = 1 }) {
  const { count, increment, decrement } = useCounter({ initialCount, step })

  return (
    <>
      <div>Count value: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </>
  )
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
  const { user } = setup(<UseCounterHookExample />)

  // 🐨 get the elements you need using screen
  const message = screen.getByText(/count value/i)
  const increment = screen.getByRole('button', { name: /increment/i })
  const decrement = screen.getByRole('button', { name: /decrement/i })

  expect(message).toBeInTheDocument()
  expect(increment).toBeInTheDocument()
  expect(decrement).toBeInTheDocument()
  // screen.debug()

  // 🐨 assert on the initial state of the hook
  expect(message).toHaveTextContent(/count value: 0/i)

  // 🐨 interact with the UI using userEvent and assert on the changes in the UI
  await user.click(increment)

  expect(message).toHaveTextContent(/count value: 1/i)

  await user.click(decrement)

  expect(message).toHaveTextContent(/count value: 0/i)
})

test('exposes the count as equal to its initialValue = 10', async () => {
  // 🐨 render the component
  setup(<UseCounterHookExample initialCount={10} />)

  // 🐨 get the elements you need using screen
  const message = screen.getByText(/count value/i)

  expect(message).toHaveTextContent(/count value: 10/i)
})

test('increments and decrements with the custom step = 10', async () => {
  // 🐨 render the component
  const { user } = setup(<UseCounterHookExample step={10} />)

  // 🐨 get the elements you need using screen
  const message = screen.getByText(/count value/i)
  const increment = screen.getByRole('button', { name: /increment/i })
  const decrement = screen.getByRole('button', { name: /decrement/i })

  // 🐨 assert on the initial state of the hook
  expect(message).toHaveTextContent(/count value: 0/i)

  // 🐨 interact with the UI using userEvent and assert on the changes in the UI
  await user.click(increment)

  expect(message).toHaveTextContent(/count value: 10/i)

  await user.click(decrement)
})

// eslint no-unused-vars:0
