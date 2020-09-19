import { isFunction, isObject, isArray } from './utils/is.ts'
import type { Func, PH, Obj, FuncArr1 } from './utils/types.ts'
import curryN from './utils/curry_n.ts'
import { reduce } from './reduce.ts'
import { dispatch } from './utils/dispatch.ts'
import MapTransformer from './utils/Transformers/map.ts'
import { getFunctionLength } from './utils/get.ts'

// TODO: more refine
// @types
type Map_2<F extends Obj<T> | Func | T[], T, R> = ((
  functor: F,
) => Func | R[] | Obj<R>) &
  ((functor?: PH) => Map_2<F, T, R>)

type Map_1<F extends Obj<T> | Func | T[], T, R> = ((
  fn: FuncArr1<T, R>,
) => Func | R[] | Obj<R>) &
  ((fn?: PH) => Map_1<F, T, R>)

type Map = (<F extends Obj<T> | Func | T[], T, R>(
  fn: FuncArr1<T, R>,
  functor: F,
) => Func | R[] | Obj<R>) &
  (<F extends Obj<T> | Func | T[], T, R>(
    fn: FuncArr1<T, R>,
    functor?: PH,
  ) => Map_2<F, T, R>) &
  (<F extends Obj<T> | Func | T[], T, R>(
    fn: PH,
    functor: F,
  ) => Map_1<F, T, R>) &
  ((fn?: PH, functor?: PH) => Map)

function _functionMap<T, R>(fn: FuncArr1<T, R>, functor: Func): Func {
  return curryN(getFunctionLength(functor), function (
    this: any,
    ...args: any[]
  ) {
    return fn.call(this, functor.apply(this, args))
  })
}

function _objectMap<T, R>(
  func: FuncArr1<T, R>,
  functor: Obj<T>,
): Obj<R> {
  return reduce(
    (acc: Obj, key: string) => {
      acc[key] = func(functor[key])
      return acc
    },
    {},
    Object.keys(functor),
  )
}

function _arrayMap<T, R>(func: FuncArr1<T, R>, functor: T[]) {
  const len = functor.length
  const result: R[] = new Array(len)
  for (let i = 0; i < len; i++) {
    result[i] = func(functor[i])
  }
  return result
}

function _map<F extends Obj<T> | Func | T[], T, R>(
  fn: FuncArr1<T, R>,
  functor: F,
) {
  if (isFunction(functor)) return _functionMap(fn, functor)
  if (isArray(functor)) return _arrayMap(fn, functor)
  if (isObject(functor)) return _objectMap(fn, functor as any)
  throw new TypeError(
    'Functor can be only array, object or a transformer',
  )
}

const dispatchedMap = dispatch(MapTransformer, _map)

/**
 * Applies `fn` to each of `functor`'s value
 * and returns functor of same shape
 *
 * Acts as a transducer if a transformer is given in `functor`.
 */
export const map: Map = curryN(2, dispatchedMap)
