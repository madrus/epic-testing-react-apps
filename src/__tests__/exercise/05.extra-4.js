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
import { rest } from 'msw'
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
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it(`logging in displays the user's username`, async () => {
  const { user } = setup(<Login />)
  const { username, password } = buildLoginForm()

  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /submit/i }))
  // screen.debug()

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
})

it(`getting error code 500 from the server displays a one-off error message`, async () => {
  const testErrorMessage = 'Oh no, something bad happened'
  server.use(
    rest.post(
      // note that it's the same URL as our app-wide handler
      // so this will override the other.
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(
          ctx.delay(10),
          ctx.status(500),
          ctx.json({ message: testErrorMessage }),
        )
      },
    ),
  )
  const { user } = setup(<Login />)

  await user.click(screen.getByRole('button', { name: /submit/i }))
  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
  // screen.debug()

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})

it(`not filling in the user's username shows an error message re. missing username`, async () => {
  const { user } = setup(<Login />)
  const { password } = buildLoginForm({
    overrides: {
      username: '',
    },
  })

  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /submit/i }))
  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
  // screen.debug()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"username required"`,
  )
})

it(`not filling in the user's password shows an error message re. missing password`, async () => {
  const { user } = setup(<Login />)
  const { username } = buildLoginForm({
    overrides: {
      password: '',
    },
  })

  await user.type(screen.getByLabelText(/username/i), username)
  await user.click(screen.getByRole('button', { name: /submit/i }))
  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
  // screen.debug()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

it(`leaving all fields empty shows an error message re. missing password`, async () => {
  const { user } = setup(<Login />)

  await user.click(screen.getByRole('button', { name: /submit/i }))
  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
  // screen.debug()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})
