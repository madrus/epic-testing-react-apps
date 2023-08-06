// form testing
// http://localhost:3000/login

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'

function setup(jsx) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

test('submitting the form calls onSubmit with username and password', async () => {
  // 🐨 create a variable called "submittedData" and a handleSubmit function that
  // accepts the data and assigns submittedData to the data that was submitted
  let submittedData

  // 💰 if you need a hand, here's what the handleSubmit function should do:
  const handleSubmit = data => (submittedData = data)

  // 🐨 render the login with your handleSubmit function as the onSubmit prop
  const { user } = setup(<Login onSubmit={handleSubmit} />)

	const username = 'madrus'
	const password = 'sudram'

  // 🐨 get the username and password fields via `getByLabelText`
  // 🐨 use `await userEvent.type...` to change the username and password fields to
  //    whatever you want
  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)

  // 🐨 click on the button with the text "Submit"
  await user.click(screen.getByRole('button', { name: /submit/i }))

	//screen.debug // if necessary

  // assert that submittedData is correct
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue
  expect(submittedData).toEqual({ username, password })
})

/*
eslint
  no-unused-vars: "off",
*/
