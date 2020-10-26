import { describe, it } from './_describe.ts'
import { until, multiply, _ } from '../mod.ts'
import { eq } from './utils/utils.ts'

describe('until', () => {
  const predicate = (i: number) => i > 20
  it('should apply function until predicate is satisfied', () => {
    eq(until(predicate, multiply(2), 1), 32)
    eq(
      until((i) => i > 0, multiply(2), 1),
      1,
    )
  })
  it('should work for curried function as well.', () => {
    eq(until(_, _, _)(predicate)(multiply(2))(1), 32)

    eq(until(_, _, 1)(predicate)(multiply(2)), 32)

    eq(until(_, multiply(2), _)(predicate)(1), 32)

    eq(until(_, multiply(2), 1)(predicate), 32)

    eq(until(predicate, _, _)(multiply(2))(1), 32)

    // eq(until(predicate, _, _)(multiply(2)), 32) //TODO: Type error correction

    eq(until(predicate, multiply(2), _)(1), 32)

    eq(until(predicate, multiply(2), 1), 32)
  })
})
