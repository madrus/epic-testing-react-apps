// Avoid implementation details
// http://localhost:3000/counter

import * as React from 'react'
// 🐨 add `screen` to the import here:
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '../../components/counter'

// setup function
function setup(jsx) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

test('counter increments and decrements when the buttons are clicked', async () => {
  const { user } = setup(<Counter />)
  // 🐨 replace these with screen queries
  // 💰 you can use `getByText` for each of these (`getByRole` can work for the button too)
  const message = screen.getByText(/current count:/i)
  const decrement = screen.getByRole('button', { name: /decrement/i })
  const increment = screen.getByRole('button', { name: /increment/i })

  expect(message).toHaveTextContent('Current count: 0')
  await user.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  await user.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
