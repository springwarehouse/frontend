import { Emitter } from './emitter.js'

const ResponseType = {
  RESPONSE: 'response',
  PUSH: 'push',
  HEARTBEAT: 'heartbeat'
}

const RequestType = {
  HEARTBEAT: 'heartbeat',
  REQUEST: 'request',
  REGISTER: 'register'
}

const Status = {
  INIT: 0,
  CONNECTTING: 1,
  OPEN: 2,
  CLOSE: 5
}

function noop() {}

export class WSClient {
  constructor(url) {
    this.emitter = new Emitter()
    this.url = url
    this.socket = null
    this.status = Status.INIT // 状态
    this._id = 0 // 请求 id, 递增
    this._reqs = {} // 请求回调列表  reqId -> cb
    this._heartbeatInterval = null
    this._timeout = null
  }

  /**
   * open,
   * message,
   * close
   *
   * [all push events]
   */
  on(route, cb, once = false) {
    this.emitter.on(route, cb, once)
  }

  off(event, cb) {
    this.emitter.off(event, cb)
  }

  close() {
    this.status = Status.CLOSE
    this._clearHeartbeat()
    this._clearTimeout()
    this.emitter.reset() // 清空所有注册的事件
    if (this.socket) {
      try {
        this.socket.close()
      } catch (e) {
        // ignore
      }
      this.socket = null
    }
  }

  connect() {
    console.log('开始连接:', this.url)
    this.status = Status.CONNECTTING
    this.socket = new WebSocket(this.url)
    this.socket.onopen = () => {
      console.log('链接打开')
      this.status = Status.OPEN
      this.emitter.trigger('open')
      this._startHeartbeat()
    }
    this.socket.onmessage = (e) => {
      this.emitter.trigger('message', e)
      let message = e.data
      if (!message) {
        return
      }
      try {
        message = JSON.parse(message)
        const { id, type, route, data } = message
        if (type === ResponseType.RESPONSE) {
          // 请求响应
          const cb = this._reqs[id]
          delete this._reqs[id]
          if (cb) {
            try {
              cb(data)
            } catch (e) {
              console.error(e)
            }
          }
        } else if (type === ResponseType.PUSH) {
          // 数据推送
          this.emitter.trigger(route, data)
        } else if (type === ResponseType.HEARTBEAT) {
          // just ignore
        } else {
          console.error('unknown reponse type:', type)
        }
      } catch (e) {
        console.log('error pase message', e)
        try {
          this.socket.close()
        } catch (e) {
          // ignore
        }
      }
    }
    this.socket.onclose = (e) => {
      console.log('连接已关闭', e)
      this._clearHeartbeat()
      this._clearTimeout()
      this.emitter.trigger('close', e)
      this._timeout = setTimeout(() => {
        if (this.status !== Status.CLOSE) {
          this.connect()
        }
      }, 2000)
    }
    this.socket.onerror = (e) => {
      console.log('连接出错', e)
      this.emitter.trigger('error', e)
    }
  }

  request(route, data, cb) {
    const id = this._nextId()
    const sendData = {
      id,
      type: RequestType.REQUEST,
      route,
      data
    }
    this._reqs[id] = cb || noop
    this.socket.send(JSON.stringify(sendData))
  }

  requestPromise(route, data) {
    return new Promise((res) => this.request(route, data, res))
  }

  _startHeartbeat() {
    this._clearHeartbeat()
    this._heartbeatInterval = setInterval(() => {
      const sendData = {
        id: 0,
        type: RequestType.HEARTBEAT
      }
      this.socket.send(JSON.stringify(sendData))
    }, 30 * 1000)
  }

  _clearHeartbeat() {
    if (this._heartbeatInterval) {
      clearInterval(this._heartbeatInterval)
      this._heartbeatInterval = null
    }
  }

  _clearTimeout() {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = null
    }
  }

  _nextId() {
    this._id++
    return this._id
  }
}
