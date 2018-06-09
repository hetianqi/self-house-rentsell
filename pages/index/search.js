// pages/index/search.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token }) => {
        this.data.token = access_token
      })
  },

  search() {
    wx.showModal({
      content: '搜索',
      showCancel: false
    })
  },

  back() {
    wx.navigateBack()
  }
})