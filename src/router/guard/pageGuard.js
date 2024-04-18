import { Emitter } from '@/utils/emitter.js'

const emitter = new Emitter()

const key = Symbol('ROUTE_CHANGE')

let latestRoute = null

export function listenerRouteChange(handler, immediate = true) {
  emitter.on(key, handler)
  if (immediate && latestRoute) {
    handler(latestRoute)
  }
}

export function removeRouteListener() {
  emitter.off(key)
}

export function setupPageGuard(router) {
  router.beforeEach(async (to) => {
    // emit route change
    emitter.trigger(key, to)
    latestRoute = to
  })
}
