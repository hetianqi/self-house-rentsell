// 首页

import { request, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()
let mapCtx, getScaleTimer

Page({
  data: {
    token: '',
    latitude: '',
    longitude: '',
    scale: 14,
    markers: [],
    isShowHouses: false
  },  
  onReady() {
    mapCtx = wx.createMapContext('map')
    app.login()
      .then(token => {
        this.data.token = token
        wx.getLocation({
          success: ({ latitude, longitude }) => {
            this.setData({ latitude, longitude })
            this.getMapData()
          }
        })
      })
  },
  // 获取房源数据
  getMapData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getScale()
    .then(() => {
      return this.getPremises()
    })
    .then((premises) => {
      this.setData({
        markers: premises.map(item => ({
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          width: 0,
          height: 0,
          iconPath: '../../images/touming.png',
          callout: {
            content: `  ${item.name}(${item.count}套)  `,
            bgColor: '#f75001',
            color: '#fff',
            borderRadius: 8,
            padding: 3,
            display: 'ALWAYS'
          }
        }))
      })
    })
    .catch(err => {
      wx.hideLoading()
      showError(err)
    })
  },
  onRegionChange(e) {
    this.getScale()
  },
  // 地图放大
  zoomIn() {
    this.setData({ scale: this.data.scale + 1 })
    this.getScale()
  },
  // 地图缩小
  zoomOut() {
    this.setData({ scale: this.data.scale - 1 })
    this.getScale()
  },
  // 由于微信没有提供map缩放事件，点击放大/缩小按钮前先主动获取一下缩放级别
  getScale() {
    return new Promise((resolve, reject) => {
      clearTimeout(getScaleTimer)
      getScaleTimer = setTimeout(() => {
        mapCtx.getScale({
          success: ({ scale }) => {
            console.log(scale)
            this.data.scale = scale
            resolve()
          },
          fail: () => {
            resolve()
          }
        })
      }, 500)  
    })
  },
  // 获取我的当前位置
  locate() {
    wx.getLocation({
      success: ({ latitude, longitude }) => {
        this.setData({ latitude, longitude })
        this.getMapData()
      }
    })
  },
  // 获取区域楼盘
  getPremises() {
    return request({
      url: apiUrl + 'house/premises',
      data: {
        access_token: this.data.token,
        scale: this.data.scale,
        lat: this.data.latitude,
        lng: this.data.longitude
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          reject(data.msg)
          return
        }
        resolve(data.data)
      })
  },
  // 展示房源列表
  showHouses(e) {
    this.setData({ isShowHouses: true })
    console.log(this.data)
  },
  // 隐藏房源列表
  hideHouses(e) {
    this.setData({ isShowHouses: false })
  },
  // 跳转到搜索页
  toSearch() {
    wx.navigateTo({
      url: './search'
    })
  },
  // 跳转到我的申请页
  toApply() {
    wx.navigateTo({
      url: '../house/apply'
    })
  },
  // 扫码进入
  scanCode() {
    wx.scanCode({
      scanType: ['qrCode'],
      success({ result }) {
        wx.showLoading({
          title: '获取房源数据...',
        });
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateTo({
            url: '../house/detail?id=1'
          });
        }, 1000);
      },
      fail() {
        wx.showLoading({
          title: '获取房源数据...',
        });
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateTo({
            url: '../house/detail?id=1'
          });
        }, 1000);
      }
    });
  }
});