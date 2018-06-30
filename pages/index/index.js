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
    houses: [],
    resourcesURI: ''
  },  

  // 页面加载
  onLoad() {
    mapCtx = wx.createMapContext('map')
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token

        const searchItem = app.globalData.searchItem
        if (searchItem) {
          this.setData({
            scale: 14,
            latitude: searchItem.lat,
            longitude: searchItem.lng,
            centerLatitude: searchItem.lat,
            centerLongitude: searchItem.lng
          })
          this.getPremises()
          this.getHouses(searchItem.premisesId)
          app.globalData.searchItem = null
        } else {
          this.locate()
        }
      })
  },

  // 地图区域改变
  onRegionChange() {
    clearTimeout(regionChangeTimer)
    regionChangeTimer = setTimeout(() => {
      mapCtx.getCenterLocation({
        success: ({ latitude, longitude }) => {
          if (latitude === this.data.centerLatitude && longitude === this.data.centerLongitude) return
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
        // this.onRegionChange()
      })
  },

  // 地图缩小
  zoomOut() {
    console.log('zoomOut')
    this.getScale()
      .then(() => {
        console.log(this.data.scale)
        if (this.data.scale <= 12) return
        this.setData({ scale: this.data.scale - 1 })
        // this.onRegionChange()
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
    request({
      url: apiUrl + 'house/premises',
      data: {
        access_token: this.access_token,
        scale: 15,
        lat: this.data.centerLatitude,
        lng: this.data.centerLongitude
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        this.data.premises = data.data
        this.setData({
          markers: this.data.premises.map(item => ({
            id: item.premisesId,
            latitude: item.lat,
            longitude: item.lng,
            width: 0,
            height: 0,
            iconPath: '../../images/touming.png',
            callout: {
              content: `  ${item.premisesName}(${item.houseCount}套)  `,
              bgColor: '#f75001',
              color: '#ffffff',
              borderRadius: 8,
              padding: 3,
              display: 'ALWAYS'
            }
          }))
        })
      })
      .catch(err => {
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
          resourcesURI: data.data.resourcesURI,
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
    this.getHouses(e.markerId)
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

  // 联系客服
  contactService() {
    app.getServicePhoneNumber()
      .then(servicePhoneNumber => {
        wx.makePhoneCall({
          phoneNumber: servicePhoneNumber
        })
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
