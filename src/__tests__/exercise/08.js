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
function TestCounter(props) {
	const { count, increment, decrement } = useCounter()

  return (
    <>
      <div>
        {`count value: ${count}`}
      </div>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </>
  )
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
	const { user } = setup(<TestCounter />)

	// 🐨 get the elements you need using screen
  const text = screen.getByText(/count value/i)
  const plus = screen.getByRole('button', { name: 'increment' })
  const minus = screen.getByRole('button', { name: 'decrement' })

  expect(text).toBeInTheDocument()
  expect(plus).toBeInTheDocument()
  expect(minus).toBeInTheDocument()
  // screen.debug()

  // 🐨 assert on the initial state of the hook
  expect(text).toHaveTextContent('count value: 0')

  // 🐨 interact with the UI using userEvent and assert on the changes in the UI
	await user.click(plus )

	expect(text).toHaveTextContent('count value: 1')

	await user.click(minus )

	expect(text).toHaveTextContent('count value: 0')
})

/* eslint no-unused-vars:0 */
