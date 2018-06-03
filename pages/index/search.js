// pages/index/search.js

import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: ''
  },

  /**
   * 页面渲染完成
   */
  onReady() {
    app.login()
      .then(token => {
        this.data.token = token
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