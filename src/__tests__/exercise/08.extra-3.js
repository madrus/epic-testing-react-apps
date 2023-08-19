// testing custom hooks
// http://localhost:3000/result-hook

import { act, renderHook } from '@testing-library/react'
import useCounter from '../../components/use-counter'

test('exposes the count and increment/decrement functions', () => {
  // 🐨 render the component
  const { result } = renderHook(() => useCounter())
  console.log(result)

  expect(result.current.count).toBe(0)

  // `act` is necessary here because we are calling an `increment` function
  // that modifies the internal state of the SUT component

  act(() => result.current.increment())
  // console.log(result)

  expect(result.current.count).toBe(1)

  act(() => result.current.decrement())
  // console.log(result)

  expect(result.current.count).toBe(0)
})

test('exposes the count as equal to its initialValue = 10', () => {
  // 🐨 render the component
  const { result } = renderHook(() => useCounter({ initialCount: 10 }))
  // console.log(result)

  expect(result.current.count).toBe(10)
})

test('increments and decrements with the custom step = 10', () => {
  // 🐨 render the component
  const { result } = renderHook(() => useCounter({ step: 20 }))

  act(() => result.current.increment())

  expect(result.current.count).toBe(20)

  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('increments with 10 and decrements with 5', () => {
  // 🐨 render the component
  const { result, rerender } = renderHook(useCounter, {
    initialProps: { step: 10 },
  })

  act(() => result.current.increment())

  expect(result.current.count).toBe(10)

  rerender({ step: 5 })

  act(() => result.current.decrement())
  expect(result.current.count).toBe(5)
})

test('increments with 10 and decrements with 5 - alternative notation', () => {
  const { result, rerender } = renderHook((props) => useCounter({ step: 10, ...props }))

  act(() => result.current.increment())
  expect(result.current.count).toBe(10)

  rerender({ step: 5 })

  act(() => result.current.decrement())
  expect(result.current.count).toBe(5)
})

// eslint no-unused-vars:0
