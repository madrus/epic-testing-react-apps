// form testing
// http://localhost:3000/login

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { faker } from '@faker-js/faker'
import Login from '../../components/login'

function setup(jsx) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

function buildLoginForm(overrides) {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}

test('submitting the form calls onSubmit with username and password', async () => {
  //	Jest has built-in "mock" function APIs. Rather than creating the `submittedData`
  //	variable, try to use a mock function and assert it was called correctly:
  //
  //	- 📜 `jest.fn()`: https://jestjs.io/docs/en/mock-function-api
  //	- 📜 `toHaveBeenCalledWith`: https://jestjs.io/docs/en/expect#tohavebeencalledwitharg1-arg2-
  const { username, password } = buildLoginForm()
  const handleSubmit = jest.fn()

  const { user } = setup(<Login onSubmit={handleSubmit} />)

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /submit/i }))

  //screen.debug // if necessary

  // assert that handleSubmit has been called correctly
  expect(handleSubmit).toHaveBeenCalledWith({ username, password })

  // and exactly two times
  expect(handleSubmit).toHaveBeenCalledTimes(1)

  const { password: specificPassword } = buildLoginForm({ password: 'abc' })
  expect(specificPassword).toEqual('abc')
})

/*
eslint
  no-unused-vars: "off",
*/
