// 首页

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()
let mapCtx, getScaleTimer, regionChangeTimer

Page({
  access_token: '',

  // 数据
  data: {
    latitude: '',
    longitude: '',
    centerLatitude: '',
    centerLongitude: '',
    scale: 16,
    markers: [],
    isShowHouses: false,
    premises: [],
    currPremise: {},
    houses: []
  },  

  // 页面显示
  onShow() {
    mapCtx = wx.createMapContext('map')
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
        this.locate()
      })
  },

  // 地图区域改变
  onRegionChange() {
    clearTimeout(regionChangeTimer)
    regionChangeTimer = setTimeout(() => {
      mapCtx.getCenterLocation({
        success: ({ latitude, longitude }) => {
          console.log(latitude)
          this.setData({
            centerLatitude: latitude,
            centerLongitude: longitude
          })
          this.getPremises()
        }
      })
    }, 300)    
  },

  // 地图放大
  zoomIn() {
    this.getScale()
      .then(() => {
        if (this.data.scale >= 18) return
        this.setData({ scale: this.data.scale + 1 })
        this.onRegionChange()
      })
  },

  // 地图缩小
  zoomOut() {
    this.getScale()
      .then(() => {
        if (this.data.scale <= 12) return
        this.setData({ scale: this.data.scale - 1 })
        this.onRegionChange()
      })
  },

  // 由于微信没有提供map缩放事件，点击放大/缩小按钮前先主动获取一下缩放级别
  getScale() {
    return new Promise((resolve, reject) => {
      clearTimeout(getScaleTimer)
      getScaleTimer = setTimeout(() => {
        mapCtx.getScale({
          success: ({ scale }) => {
            this.data.scale = parseInt(scale)
            resolve()
          },
          fail: () => {
            resolve()
          }
        })
      }, 100)  
    })
  },

  // 获取我的当前位置
  locate() {
    wx.getLocation({
      success: ({ latitude, longitude }) => {
        latitude = 30.61857
        longitude = 104.05224
        this.setData({
          latitude,
          longitude,
          centerLatitude: latitude,
          centerLongitude: longitude
        })
        this.getPremises()
      }
    })
  },

  // 获取区域楼盘
  getPremises() {
    // showLoading('加载中...')
    request({
      url: apiUrl + 'house/premises',
      data: {
        access_token: this.access_token,
        scale: this.data.scale,
        lat: this.data.centerLatitude,
        lng: this.data.centerLongitude
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        // wx.hideLoading()
        this.data.premises = data.data
        const isHouseScale = this.data.scale > 12
        this.setData({
          markers: this.data.premises.map(item => ({
            id: isHouseScale ? item.premisesId : item.areasId,
            latitude: item.lat,
            longitude: item.lng,
            width: 0,
            height: 0,
            iconPath: '../../images/touming.png',
            callout: {
              content: `  ${isHouseScale ? item.premisesName : item.areasName}(${item.houseCount}套)  `,
              bgColor: '#f75001',
              color: '#fff',
              borderRadius: isHouseScale ? 8 : 10000,
              padding: isHouseScale ? 3 : 10,
              display: 'ALWAYS'
            }
          }))
        })
      })
      .catch(err => {
        // wx.hideLoading()
        showError(err)
      })
  },

  // 展示房源列表
  getHouses(premisesId) {
    showLoading('加载中...')
    request({
      url: apiUrl + 'house/list',
      data: {
        access_token: this.access_token,
        premisesId
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        this.setData({
          currPremise: data.data.premises,
          houses: data.data.houseInfo,
          isShowHouses: true
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
      })
  },

  // 点击气泡
  onMarkerTab(e) {
    if (this.data.scale > 12) {
      this.getHouses(e.markerId)
    } else {
      const item = this.data.premises.find(a => a.areasId === e.markerId)
      this.setData({
        scale: 16,
        centerLatitude: item.lat,
        centerLongitude: item.lng
      })
      this.getPremises()
    }
  },

  // 地图点击
  hideHouses(e) {
    this.setData({ isShowHouses: false })
  },

  // 去房源详情
  toHouseDetail(e) {
    console.log(e)
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../house/detail?houseId=' + item.houseId
    })
  },

  // 去搜索页
  toSearch() {
    wx.navigateTo({
      url: './search'
    })
  },

  // 去我的申请页
  toApply() {
    wx.navigateTo({
      url: '../house/apply'
    })
  },

  // 扫码进入
  scanCode() {
    wx.scanCode({
      scanType: ['qrCode'],
      success: ({ result }) => {
        showLoading('正在获取房源数据...')
        setTimeout(() => {
          wx.hideLoading()
          wx.navigateTo({
            url: '../house/detail?id=1'
          })
        }, 1000)
      }
    })
  }
})
