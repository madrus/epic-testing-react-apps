// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { handlers } from '../../test/server-handlers'
import Login from '../../components/login-submission'

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

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  const { user } = setup(<Login />)
  const { username, password } = buildLoginForm()

  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /submit/i }))
  // screen.debug()

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
})
