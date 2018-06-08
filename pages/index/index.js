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
    isShowHouses: false,
    premises: [],
    houses: []
  },  
  onShow() {
    mapCtx = wx.createMapContext('map')
    app.login()
      .then(token => {
        this.data.token = token
        wx.getLocation({
          success: ({ latitude, longitude }) => {
            this.setData({ latitude, longitude })
            this.getPremises()
          }
        })
      })
  },
  onRegionChange(e) {
    // this.getScale()
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
            this.data.scale = parseInt(scale)
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
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    request({
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
          return Promise.reject(data.msg)
        }
        wx.hideLoading()
        this.data.premises = data.data
        const isHouseScale = this.data.scale > 15
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
        wx.hideLoading()
        showError(err)
      })
  },
  // 展示房源列表
  getHouses(premisesId) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    request({
      url: apiUrl + 'house/list',
      data: {
        access_token: this.data.token,
        premisesId
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          return Promise.reject(data.msg)
        }
        wx.hideLoading()
        this.setData({
          houses: [{id: 1}, {id: 2}],
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
    if (this.data.scale > 15) {
      this.getHouses(e.markerId)
    } else {
      const item = this.data.premises.find(a => a.areasId === e.markerId)
      this.setData({
        scale: 16,
        lantitude: item.lat,
        longitude: item.lng
      });
      this.getPremises()
    }
  },
  // 地图点击
  onTab(e) {
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