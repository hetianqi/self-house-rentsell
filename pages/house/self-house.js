// pages/apply/self-house.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    houseId: '',
    isSearchingDevices: false,
    device: null,
    service: null,
    characteristic: null,
    power: 0,
    randomFactor: 0
  },

  // 页面加载
  onLoad(options) {
    this.setData({ houseId: options.houseId })
  },

  // 页面显示
  onShow() {
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
          houseInfo: data.data.houseInfo
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err.message)
      })
  },

  // 蓝牙开锁
  unlockWithBluetooth() {
    this.openBuletooth()
      .then(() => {
        showLoading('正在搜索设备...')
        return this.searchDevice()
      })
      .then(device => {
        showLoading('正在连接设备...')
        console.log(device)
        this.setData({ device })
        return this.createConnection()
      })
      .then(() => {
        showLoading('正在获取设备服务...')
        return this.getService()
      })
      .then((service) => {
        showLoading('正在获取设备特征值...')
        console.log(service)
        this.setData({ service })
        return this.getCharacteristics()
      })
      .then((characteristic) => {
        showLoading('正在notify设备...')
        console.log(characteristic)
        this.setData({ characteristic })
        return this.notifyDevice()
      })
      .then(() => {
        showLoading('正在唤醒设备...')
        return this.awakeDevice()
      })
      .then(() => {
        showLoading('正在获取电量...')
        return this.getPowerAndRandomFactor()
      })
      .then(({ power, randomFactor }) => {
        showLoading('正在获取密钥...')
        this.setData({ power, randomFactor })
        return this.getKey()
      })
      .then((data) => {
        console.log(data)
        this.setData({ key: data.key })
      })
      .catch((err) => {
        wx.hideLoading()
        showError(err)
      })
  },

  // 打开蓝牙
  openBuletooth() {
    return new Promise((resolve, reject) => {
      wx.openBluetoothAdapter({
        success: (arg) => {
          console.log(arg)
          resolve()
        },
        fail: ({ errCode }) => {
          if (errCode === 10001) {
            showError('蓝牙开关未开启或者手机不支持蓝牙功能')
          }
        }
      })
      wx.onBluetoothAdapterStateChange(({ available, discovering }) => {
        if (available) {
          resolve()
        }
      })
    })    
  },

  // 搜索门锁的蓝牙设备
  searchDevice() {
    if (this.data.isSearching) return;
    return new Promise((resolve, reject) => {
      console.log('开始搜索设备')
      this.setData({ isSearching: true })
      wx.startBluetoothDevicesDiscovery({
        success: (res) => {
          console.log('开始搜索设备成功', res)
          wx.onBluetoothDeviceFound(({ devices }) => {
            console.log(devices)
            for (let i in devices) {
              if (devices[i].name.indexOf('WeLock') > -1) {
                resolve(devices[i])
                wx.stopBluetoothDevicesDiscovery({
                  success: (res) => {
                    console.log('停止搜索成功', res)
                    this.setData({ isSearching: false })
                  }
                })
                return
              }
            }
          })
        }
      })
    })    
  },

  // 连接低功耗蓝牙设备
  createConnection: function () {
    return new Promise((resolve, reject) => {
      wx.createBLEConnection({
        deviceId: this.data.device.deviceId,
        success: () => {
          resolve()
        },
        fail: ({ errCode, errMsg }) => {
          reject('连接设备失败：' + errMsg)
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
          for (let i in services) {
            if (services[i].uuid.indexOf('6E400001-B5A3-F393-E0A9-E50E24DCCA9E') > -1) {
              resolve(services[i])
              return
            }
          }
          reject('未获取到服务')
        },
        fail: ({ errCode, errMsg }) => {
          reject('获取服务失败：' + errMsg)
        }
      })
    })    
  },

  // 读取特征值
  getCharacteristics: function () {
    return new Promise((resolve, reject) => {
      wx.getBLEDeviceCharacteristics({
        deviceId: this.data.device.deviceId,
        serviceId: this.data.service.uuid,
        success: ({ characteristics }) => {
          for (let i in characteristics) {
            if (characteristics[i].uuid.indexOf('6E400002-B5A3-F393-E0A9-E50E24DCCA9E') > -1) {
              resolve(characteristics[i])
              return
            }
          }
          reject('未获取到特征值')
        },
        fail: ({ errCode, errMsg }) => {
          reject('获取特征值失败：' + errMsg)
        }
      })
    })    
  },

  // notify设备
  notifyDevice() {
    return new Promise((resolve, reject) => {
      wx.notifyBLECharacteristicValueChange({
        state: true,  // 启动notify
        deviceId: this.data.device.deviceId,
        serviceId: this.data.service.uuid,
        // characteristicId: this.data.characteristic.uuid,
        characteristicId: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',// 6E400002-B5A3-F393-E0A9-E50E24DCCA9E
        success: (res) => {
          console.log('notify成功', res)
          resolve()
        },
        fail: ({ errCode, errMsg }) => {
          reject('notify失败：' + errMsg)
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
        serviceId: this.data.service.uuid,
        characteristicId: this.data.characteristic.uuid,
        value: sendInfo,
        success: (res) => {
          console.log('唤醒指令发送成功!', res)
          resolve()          
        },
        fail: ({ errCode, errMsg }) => {
          reject('发送失败：' + errMsg)
        }
      })
    })    
  },

  // 读取电量和随机因子
  getPowerAndRandomFactor() {
    return new Promise((resolve, reject) => {
      let awakenHex = '553000000000000000000000000000'
      let awakenTypedArray = new Uint8Array(awakenHex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)))
      let buffer = new ArrayBuffer(15)
      let sendInfo = awakenTypedArray.buffer
      
      wx.writeBLECharacteristicValue({
        deviceId: this.data.device.deviceId,
        serviceId: this.data.service.uuid,
        characteristicId: this.data.characteristic.uuid,
        value: sendInfo,
        success: (res) => {
          console.log('获取电量指令发送成功!', res)
          wx.onBLECharacteristicValueChange((res) => {
            console.log('onBleCharactisticValueChange', res.value)
            let resHex = Array.prototype.map.call(new Uint8Array(res.value), x => ('00' + x.toString(16)).slice(-2)).join('')
            let eletemp = resHex.substring(6, 8)
            let fac = resHex.substring(4, 6)

            resolve({
              power: parseInt(eletemp, 16),
              randomFactor: parseInt(fac, 16)
            })
          })
        },
        fail: ({ errCode, errMsg }) => {
          reject('获取电量指令发送失败：' + errMsg)
        }
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
        lockNum: this.data.houseInfo.key,
        lockName: this.data.device.name
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        return data.data
      })
  },

  // 开锁
  openLock() {
    return new Promise((resolve, reject) => {
      let keys = strToHexCharCode(this.data.key)
      let keyArray = new Uint8Array(keys.match(/[\da-f]{2}/gi).map((h) => parseInt(h, 16)))
      let buffer = new ArrayBuffer(15)
      let sendInfo = keyArray.buffer

      wx.writeBLECharacteristicValue({
        deviceId: this.data.device.deviceId,
        serviceId: this.data.service.uuid,
        characteristicId: this.data.characteristic.uuid,
        value: sendInfo,
        success: (res) => {
          console.log('开锁指令发送成功!', res)
          resolve()
        },
        fail: ({ errCode, errMsg }) => {
          reject('开锁指令发送失败：' + errMsg)
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