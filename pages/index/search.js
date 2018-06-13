// pages/index/search.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    keyword: '',
    list: []
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
      })
  },

  updateKeyword(e) {
    this.setData({
      keyword: e.detail.value.trim()
    })
  },

  search() {
    if (!this.data.keyword) {
      return
    }
    showLoading('搜索中...')
    request({
      url: apiUrl + 'house/search',
      data: {
        access_token: this.access_token,
        keyWords: this.data.keyword
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        this.setData({ list: data.data })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
      })
  },

  back() {
    wx.navigateBack()
  }
})