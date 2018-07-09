// pages/index/search.js

import { request, showLoading, showError, debounce } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
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

  search: debounce(function (e) {
    let keyword = e.detail.value.trim();
    if (!keyword) {
      return
    }
    request({
      url: apiUrl + 'house/search',
      data: {
        access_token: this.access_token,
        keyWords: keyword
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          // throw new Error(data.msg)
          console.log(data.msg)
          return;
        }
        this.setData({ list: data.data })
      })
      .catch(err => {
        console.log(err)
      })
  }, 400),

  viewPremises(e) {
    app.globalData.searchItem = e.currentTarget.dataset.data
    wx.navigateTo({
      url: './index'
    })
  },

  back() {
    wx.navigateBack()
  }
})