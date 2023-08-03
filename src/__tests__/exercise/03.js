// Avoid implementation details
// http://localhost:3000/counter

import * as React from 'react'
// 🐨 add `screen` to the import here:
import {fireEvent, render} from '@testing-library/react'
import Counter from '../../components/counter'

test('counter increments and decrements when the buttons are clicked', () => {
  const {getAllByRole, getByText} = render(<Counter />)
  // 🐨 replace these with screen queries
  // 💰 you can use `getByText` for each of these (`getByRole` can work for the button too)
  const [decrement, increment] = getAllByRole('button')
  const message = getByText(/Current count:/)

  expect(message).toHaveTextContent('Current count: 0')
  fireEvent.click(increment)
  expect(message).toHaveTextContent('Current count: 1')
  fireEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
