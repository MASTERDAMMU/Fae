import { isString } from "./utils/is.ts"
import curryN from "./utils/curry_n.ts"
import { Curry1 } from "./utils/types.ts"

function _reverse<T = any>(functor: Array<T> | String) {
  if(isString(functor)) return functor.split('').reverse().join('')
  return [...functor].reverse()
}

/** Reverses given string or array without affecting the original. */
export const reverse: Curry1<Array<any> | String> = curryN(1, _reverse)
