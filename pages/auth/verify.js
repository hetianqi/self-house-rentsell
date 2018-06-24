// pages/auth/verify.js

import { request, showError, showLoading } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  
  // 页面数据
  data: {
    houseImgs: [],
    resourcesURI: '',
    currHouseImgIndex: 0
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
      })
    this.setData({
      houseImgs: app.globalData.houseImgs,
      resourcesURI: app.globalData.resourcesURI
    })
  },

  // 照片切换
  onHouseImgSwipe(e) {
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
          url: './real-name-auth'
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
      })
  }
})