// pages/mp-applications/index.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    activeIndex: 'rent',
    list: [],
    stateMap: {
      0: '未授权',
      1: '拒绝授权',
      2: '已授权'
    },
    payResult: '',
    apiUrl: apiUrl
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
        this.setData({
          payResult
        })
        this.getList()
      })
  },

  // tab切换
  onTabChange(e) {
    this.setData({ activeIndex: e.detail.index })
    this.getList()
  },

  // 获取列表
  getList() {
    showLoading('加载中...')
    request({
      url: apiUrl + 'house/records',
      data: {
        access_token: this.access_token,
        houseType: this.data.activeIndex
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
        showError(data.msg)
      })
  },

  // 去支付
  toPay() {
    wx.navigateTo({
      url: '../deposit/pay'
    })
  },

  // 房源跳转
  jump(e) {
    let item = e.currentTarget.dataset.item
    if (item.state !== 2) return
    wx.navigateTo({
      url: '../house/self-house?houseId=' + item.id
    })
  }
})