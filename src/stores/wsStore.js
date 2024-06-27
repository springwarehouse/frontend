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
    ws.off(`template1.data`)
    ws.off('message.data')
  })

  return {
    ws,
    connected
  }
})

// 接收信息
export function useWsInfo(cb) {
  const wsStore = useWsStore()
  const { ws } = wsStore
  const { connected } = storeToRefs(wsStore)

  watch(
    connected,
    (conn) => {
      if (conn) {
        ws.on('message.data', cb)
      } else {
        ws.off('message.data', cb)
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
      'template1.start',
      {
        module,
        deviceId
      },
      () => {
        ws.on(`template1.data`, callback)
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
      'template1.stop',
      {
        module,
        deviceId
      },
      () => {
        ws.off(`template1.data`, cb)
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
