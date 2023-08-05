// form testing
// http://localhost:3000/login

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import Login from '../../components/login'

function setup(jsx) {
  return {
    user: userEvent.setup(),
    // Import `render` from the framework library of your choice.
    // See https://testing-library.com/docs/dom-testing-library/install#wrappers
    ...render(jsx),
  }
}

const buildLoginForm = build({
  fields: {
    username: perBuild(() => faker.internet.userName()),
    password: perBuild(() => faker.internet.password()),
  },
})

test('submitting the form calls onSubmit with username and password', async () => {
  //	Jest has built-in "mock" function APIs. Rather than creating the `submittedData`
  //	variable, try to use a mock function and assert it was called correctly:
  //
  //	- 📜 `jest.fn()`: https://jestjs.io/docs/en/mock-function-api
  //	- 📜 `toHaveBeenCalledWith`: https://jestjs.io/docs/en/expect#tohavebeencalledwitharg1-arg2-
  let credentials = buildLoginForm()
  console.log(credentials)
  const credentials1 = buildLoginForm()
  console.log(credentials1)
	expect(credentials1.username).not.toEqual(credentials.username)
	expect(credentials1.password).not.toEqual(credentials.password)

  const handleSubmit = jest.fn()

  const { user } = setup(<Login onSubmit={handleSubmit} />)

  await userEvent.type(screen.getByLabelText(/username/i), credentials.username)
  await userEvent.type(screen.getByLabelText(/password/i), credentials.password)
  await user.click(screen.getByRole('button', { name: /submit/i }))

  //screen.debug // if necessary

  // assert that handleSubmit has been called correctly
  expect(handleSubmit).toHaveBeenCalledWith(credentials)

  // and exactly two times
  expect(handleSubmit).toHaveBeenCalledTimes(1)

  credentials = buildLoginForm({
    overrides: { password: 'abc' },
  })
  console.log(credentials)
  expect(credentials.password).toEqual('abc')
})

/*
eslint
  no-unused-vars: "off",
*/
