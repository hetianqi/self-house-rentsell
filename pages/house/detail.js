// pages/house/detail.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  validate: '',

  // 页面数据
  data: {
    emptyStr: '',
    currHouseImgIndex: 0,
    resourcesURI: '',
    houseImgs: [],
    houseInfo: {},
    premiseInfo: {},
    unit: {},
    build: {},
    leaveMsg: [],
    detailCollapsed: false
  },

  // 页面加载
  onLoad(options) {
    app.globalData.houseId = options.houseId
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, validate }) => {
        this.access_token = access_token
        this.validate = validate
        this.getHouseDetail()
      })
  },
  
  // 获取房源详情
  getHouseDetail() {
    if (!app.globalData.houseId) return
    showLoading('加载中...')
    request({
      url: apiUrl + 'house/Detail',
      data: {
        access_token: this.access_token,
        houseId: app.globalData.houseId
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        this.setData({
          resourcesURI: data.data.resourcesURI,
          houseImgs: data.data.houseImg.map(a => {
            a.date = (a.time || '').substring(0, 10)
            return a
          }),
          houseInfo: data.data.houseInfo,
          premiseInfo: data.data.premises,
          build: data.data.build,
          unit: data.data.unit,
          leaveMsg: data.data.leaveMsg || []
        })
        app.globalData.houseImgs = this.data.houseImgs
        app.globalData.resourcesURI = this.data.resourcesURI
      })
      .catch(err => {
        wx.hideLoading()
        showError(err.message)
      })
  },

  // 照片切换
  onHouseImgSwipe(e) {
    this.setData({
      currHouseImgIndex: e.detail.current
    })
  },

  // 显示隐藏某个tab
  toggleExpand(e) {
    let field = e.currentTarget.dataset.field;
    this.setData({ [field]: !this.data[field] });
  },

  // 去微聊
  toWechat() {
    wx.navigateTo({
      url: './wechat'
    })
  },
  
  // 申请看房
  toApply() {
    if (this.validate !== '1') {
      wx.navigateTo({
        url: '../auth/verify'
      })
    } else {
      wx.navigateTo({
        url: './reserve'
      })
    }
  }
});