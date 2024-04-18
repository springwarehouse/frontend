import { setupPageGuard } from './pageGuard'
export { listenerRouteChange, removeRouteListener } from './pageGuard'

export function createRouteGuard(router) {
  setupPageGuard(router)
  // setupUserLoginInfoGuard(router)
  // setupPermissionGuard(router)
}
