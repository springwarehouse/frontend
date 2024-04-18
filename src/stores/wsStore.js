import { ref, onMounted, onUnmounted, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { WSClient } from '@/utils/wsclient'

function getWsUrlByHost(path) {
  // dev
  if (import.meta.env.DEV) {
    return `ws://localhost:19300${path}`
  }
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}${path}`
}

export const useWsStore = defineStore('ws', () => {
  const ws = new WSClient(getWsUrlByHost('/ws'))
  const connected = ref(false)

  ws.connect()
  ws.on('open', () => {
    connected.value = true
  })
  ws.on('close', () => {
    connected.value = false
    ws.off(`monitor.data`)
    ws.off('warning.data')
  })

  return {
    ws,
    connected
  }
})

// 接收告警信息
export function useWsWarning(cb) {
  const wsStore = useWsStore()
  const { ws } = wsStore
  const { connected } = storeToRefs(wsStore)

  watch(
    connected,
    (conn) => {
      if (conn) {
        ws.on('warning.data', cb)
      } else {
        ws.off('warning.data', cb)
      }
    },
    {
      immediate: true
    }
  )
}

// 接收监控数据
export function useWsDataMonitor() {
  const wsStore = useWsStore()
  const { ws } = wsStore
  const { connected } = storeToRefs(wsStore)

  const mounted = ref(false)

  function startMonitor({ module, deviceId, cb }) {
    if (!connected.value) {
      console.log('ws not connected')
      return
    }

    // { module: 'xx', deviceId: '1', type: '', time: '', value: {...}}
    function callback(data) {
      if (!cb) return
      if (data.module === module && data.deviceId === deviceId) {
        cb(data)
      }
    }
    ws.request(
      'monitor.start',
      {
        module,
        deviceId
      },
      () => {
        ws.on(`monitor.data`, callback)
      }
    )
    return () => stopMonitor({ module, deviceId, cb: callback })
  }

  // deviceId 为 null, 则停止此 module 下的所有监控
  function stopMonitor({ module, deviceId, cb }) {
    if (!connected.value) {
      return
    }
    ws.request(
      'monitor.stop',
      {
        module,
        deviceId
      },
      () => {
        ws.off(`monitor.data`, cb)
      }
    )
  }

  onMounted(() => (mounted.value = true))
  onUnmounted(() => {})

  return {
    connected,
    startMonitor
  }
}
