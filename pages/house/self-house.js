// pages/apply/self-house.js

import { request, showLoading, showError, showSuccess } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    houseId: '',
    houseInfo: null,
    lock: null,
    openLockProgress: '', // 开锁进度，为空表示未进行开锁或取消开锁
    device: null,
    services: null,
    characteristics: null,
    power: 0,
    randomFactor: 0
  },

  // 页面加载
  onLoad(options) {
    this.setData({ houseId: options.houseId })
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
        this.getHouseInfo()
      })
  },

  // 获取房源详情
  getHouseInfo() {
    if (!this.data.houseId) return
    showLoading('加载中...')
    request({
      url: apiUrl + 'house/Detail',
      data: {
        access_token: this.access_token,
        houseId: this.data.houseId
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        this.setData({
          houseInfo: data.data.houseInfo,
          lock: data.data.lock
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err.message)
      })
  },

  // 蓝牙开锁
  openLockWithBluetooth() {
    this.openBuletooth()
      .then(() => {
        this.setData({ openLockProgress: '正在搜索设备...' })
        if (this.data.device) {
          return Promise.resolve(this.data.device)
        }
        return this.searchDevice()
      })
      .then(device => {
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 1 })
        }
        this.setData({
          device,
          openLockProgress: '正在连接设备...'
        })
        return this.createConnection()
      })
      .then(() => {
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 2 })
        }
        this.setData({ openLockProgress: '正在获取设备服务...' })
        return this.getService()
      })
      .then((services) => {
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 3 })
        }
        this.setData({
          services,
          openLockProgress: '正在获取设备特征值...'
        })
        return this.getCharacteristics()
      })
      .then((characteristics) => {
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 4 })
        }
        this.setData({
          characteristics,
          openLockProgress: '正在通知设备...'
        })
        return this.notifyDevice()
      })
      .then(() => {
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 5 })
        }
        this.setData({ openLockProgress: '正在唤醒设备...' })
        return this.awakeDevice()
      })
      .then(() => {
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 6 })
        }
        this.setData({ openLockProgress: '正在获取设备电量...' })
        return this.getPowerAndRandomFactor()
      })
      .then(({ power, randomFactor }) => {
        console.log(power, randomFactor)
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 7 })
        }
        this.setData({ 
          power,
          randomFactor,
          openLockProgress: '正在获取密钥...'
        })
        return this.getKey()
      })
      .then((key) => {
        console.log(key)
        if (!this.data.openLockProgress) {
          return Promise.reject({ errorCode: 8 })
        }
        this.setData({
          key: key,
          openLockProgress: '正在开锁...'
        })
        return this.openLock()
      })
      .then(() => {
        this.setData({
          openLockProgress: ''
        })
        showSuccess('开锁成功')
      })
      .catch((err) => {
        console.log(err)
        const { errCode, errMsg } = err
        this.setData({ openLockProgress: '' })
        if (errCode === 10001) {
          showError('蓝牙开关未开启或者手机不支持蓝牙功能')
        } else if (errCode < 1 || errCode > 10) {
          showError(errMsg)
        } else {
          if (errCode === 1) { // 在搜索设备阶段取消开锁
            wx.stopBluetoothDevicesDiscovery({
              success: (res) => {
                console.log('停止搜索成功', res)
                this.setData({ isSearching: false })
              }
            })
          }
        }
        wx.closeBluetoothAdapter()
      })
  },

  // 取消蓝牙开锁
  cancelOpenLockWithBluetooth() {
    this.setData({ openLockProgress: '' })
    wx.closeBluetoothAdapter()
  },

  // 打开蓝牙
  openBuletooth() {
    return new Promise((resolve, reject) => {
      wx.openBluetoothAdapter({
        success: (arg) => {
          console.log('蓝牙打开成功', arg)
          resolve()
        },
        fail: ({ errCode, errMsg }) => {
          wx.closeBluetoothAdapter()
          reject({ errCode, errMsg })
        }
      })
      wx.onBluetoothAdapterStateChange(({ available, discovering }) => {
        console.log('蓝牙状态变化', available, discovering)
        if (available) {
          resolve()
        }
      })
    })    
  },

  // 搜索设备
  searchDevice() {
    return new Promise((resolve, reject) => {
      wx.startBluetoothDevicesDiscovery({
        success: (res) => {
          console.log('开始搜索设备', res)
        },
        fail: ({ errCode, errMsg }) => {
          console.log('搜索设备失败', errMsg)
          reject({ errCode, errMsg: '搜索设备失败' })
        }
      })
      wx.onBluetoothDeviceFound(({ devices }) => {
        console.log(devices)
        for (let i = 0, l = devices.length; i < l; i++) {
          if (devices[i].name === this.data.lock.lockName) {
            resolve(devices[i])
            wx.stopBluetoothDevicesDiscovery({
              success: (res) => {
                console.log('找到设备，停止搜索成功', res)
              }
            })
            return
          }
        }
      })
    })    
  },

  // 连接低功耗蓝牙设备
  createConnection: function () {
    return new Promise((resolve, reject) => {
      wx.createBLEConnection({
        deviceId: this.data.device.deviceId,
        success: (data, arg1) => {
          console.log(arg1)
          resolve()
        },
        fail: ({ errCode, errMsg }) => {
          console.log('连接设备失败', errMsg)
          reject({ errCode, errMsg: '连接设备失败' })
          this.setData({ device: null })
        }
      })
    })
  },

  // 读取服务
  getService: function () {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceServices({
        deviceId: this.data.device.deviceId,
        success: ({ services}) => {
          console.log('服务', services)
          resolve(services)
        },
        fail: ({ errCode, errMsg }) => {
          console.log('获取服务失败：', errMsg)
          reject({ errCode, errMsg: '获取服务失败' })
        }
      })
    })    
  },

  // 读取特征值
  getCharacteristics: function () {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceCharacteristics({
        deviceId: this.data.device.deviceId,
        serviceId: this.data.services[0].uuid,
        success: ({ characteristics }) => {
          console.log('特征值', characteristics)
          resolve(characteristics)
        },
        fail: ({ errCode, errMsg }) => {
          console.log('获取特征值失败：', errMsg)
          reject({ errCode, errMsg: '获取特征值失败' })
        }
      })
    })    
  },

  // 通知设备
  notifyDevice() {
    return new Promise((resolve, reject) => {
      wx.notifyBLECharacteristicValueChange({
        state: true,  // 启动notify
        deviceId: this.data.device.deviceId,
        serviceId: this.data.services[0].uuid,
        characteristicId: this.data.characteristics.find(a => a.properties.notify).uuid,
        // characteristicId: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
        success: (res) => {
          console.log('通知设备成功', res)
          resolve()
        },
        fail: ({ errCode, errMsg }) => {
          console.log('通知设备失败：', errMsg)
          reject({ errCode, errMsg: '通知设备失败' })
        }
      })
    })    
  },

  // 唤醒设备
  awakeDevice() {
    return new Promise((resolve, reject) => {
      // 唤醒指令
      let awakenHex = '550000000000000000000000000000'
      let awakenTypedArray = new Uint8Array(awakenHex.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)))
      let buffer = new ArrayBuffer(15);
      let sendInfo = awakenTypedArray.buffer;

      wx.writeBLECharacteristicValue({
        deviceId: this.data.device.deviceId,
        serviceId: this.data.services[0].uuid,
        characteristicId: this.data.characteristics.find(a => a.properties.write).uuid,
        // characteristicId: 6E400002-B5A3-F393-E0A9-E50E24DCCA9E,
        value: sendInfo,
        success: (res) => {
          console.log('唤醒指令发送成功', res)
          resolve()          
        },
        fail: ({ errCode, errMsg }) => {
          console.log('唤醒指令发送失败：', errMsg)
          reject({ errCode, errMsg: '唤醒指令发送失败' })
        }
      })
    })    
  },

  // 读取电量和随机因子
  getPowerAndRandomFactor() {
    return new Promise((resolve, reject) => {
      let awakenHex = '553000000000000000000000000000'
      let awakenTypedArray = new Uint8Array(awakenHex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)))
      let sendInfo = awakenTypedArray.buffer

      // 写指令
      wx.writeBLECharacteristicValue({
        deviceId: this.data.device.deviceId,
        serviceId: this.data.services[0].uuid,
        characteristicId: this.data.characteristics.find(a => a.properties.write).uuid,
        // characteristicId: 6E400002-B5A3-F393-E0A9-E50E24DCCA9E,
        value: sendInfo,
        success: (res) => {
          console.log('获取电量指令发送成功!', res)
        },
        fail: ({ errCode, errMsg }) => {
          console.log('获取电量指令发送失败：', errMsg)
          reject({ errCode, errMsg: '获取电量指令发送失败' })
        }
      })
      // 监听特征值变化
      wx.onBLECharacteristicValueChange((res) => {
        console.log('电量和随机因子返回特征值：', res)
        let resHex = Array.prototype.map.call(new Uint8Array(res.value), x => ('00' + x.toString(16)).slice(-2)).join('')
        let eletemp = resHex.substring(6, 8)
        let fac = resHex.substring(4, 6)

        resolve({
          power: parseInt(eletemp, 16),
          randomFactor: parseInt(fac, 16)
        })
      })
    })
  },

  // 获取开锁密钥
  getKey() {
    return request({
      url: apiUrl + 'lock/key',
      data: {
        access_token: this.access_token,
        power: this.data.power,
        randomFactor: this.data.randomFactor,
        houseId: this.data.houseId,
        lockNum: this.data.lock.lockNum,
        lockName: this.data.lock.lockName
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          return Promise.reject({ errCode: data.code, errMsg: data.msg })
        }
        return 'U1' + data.data.errmsg
      })
  },

  // 发送开锁指令
  openLock() {
    return new Promise((resolve, reject) => {
      let keys = strToHexCharCode(this.data.key)
      let keyArray = new Uint8Array(keys.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)))
      let sendInfo = keyArray.buffer

      wx.writeBLECharacteristicValue({
        deviceId: this.data.device.deviceId,
        serviceId: this.data.services[0].uuid,
        characteristicId: this.data.characteristics.find(a => a.properties.write).uuid,
        // characteristicId: 6E400002-B5A3-F393-E0A9-E50E24DCCA9E,
        value: sendInfo,
        success: (res) => {
          console.log('发送开锁指令成功', res)
        },
        fail: ({ errCode, errMsg }) => {
          console.log('发送开锁指令失败：', res)
          reject({ errCode, errMsg: '发送开锁指令失败' })
        }
      })
      // 监听特征值变化
      wx.onBLECharacteristicValueChange((res) => {
        console.log('开锁返回特征值：', res)
        let resHex = Array.prototype.map.call(new Uint8Array(res.value), x => ('00' + x.toString(16)).slice(-2)).join('')
        console.log(resHex)
        if (resHex.substring(4, 6) === '01') {
          resolve()
        } else {
          reject({ errCode: 1000, errMsg: '开锁失败' })
        }        
      })
    })
  },
})

// 字符串转16进制
function strToHexCharCode(str) {
  if (str === '') return ''
  let hexCharCode = []
  for (let i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16))
  }
  return hexCharCode.join('')
}