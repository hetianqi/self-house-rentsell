// pages/auth/verify.js

import { request, showError, showLoading } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  
  // 页面数据
  data: {
    houseId: '',
    houseImgs: [],
    currHouseImgIndex: 0,
    resourcesURI: ''
  },

  // 页面加载
  onLoad(options) {
    console.log(options)
    this.setData({
      houseId: options.houseId,
      houseImgs: app.globalData.houseImgs,
      resourcesURI: app.globalData.resourcesURI
    })
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
      })
  },

  // 照片切换
  onHouseImgSwipe(e) {
    console.log(e.detail)
    this.setData({
      currHouseImgIndex: e.detail.current
    })
  },
  
  // 微信登录
  wechatLogin({ detail }) {
    showLoading('登录中...')
    request({
      url: apiUrl + 'user/decrypt',
      method: 'POST',
      data: {
        access_token: this.access_token,
        iv: detail.iv,
        encryptData: detail.encryptedData
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        app.globalData.phoneNumber = data.data.phoneNumber
        wx.navigateTo({
          url: './real-name-auth?houseId=' + this.data.houseId
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
      })
  }
})