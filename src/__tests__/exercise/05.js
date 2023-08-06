// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import userEvent from '@testing-library/user-event'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import { rest } from 'msw'
import { setupServer } from 'msw/node'
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

// 🐨 get the server setup with an async function to handle the login POST request:
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/
const server = setupServer(
  rest.post(
    'https://auth-provider.example.com/api/login',
    async (req, res, ctx) => {
			const { username } = req.body
      return res(ctx.json({ username }))
    },
  ),
)

// 🐨 before all the tests, start the server with `server.listen()`
// 🐨 after all the tests, stop the server with `server.close()`
beforeAll(() => server.listen())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  const { user } = setup(<Login />)
  const { username, password } = buildLoginForm()

  await user.type(screen.getByLabelText(/username/i), username)
  await user.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  await user.click(screen.getByRole('button', { name: /submit/i }))

  // as soon as the user hits submit, we render a spinner to the screen. That
  // spinner has an aria-label of "loading" for accessibility purposes, so
  // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved
	await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
	// screen.debug()

  // once the login is successful, then the loading spinner disappears and
  // we render the username.
  // 🐨 assert that the username is on the screen
	expect(screen.getByText(username)).toBeInTheDocument()
})
