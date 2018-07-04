// pages/mp-applications/index.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  payResult: '',
  list: [],

  // 页面数据
  data: {
    activeIndex: 'rent',
    showList: [],
    stateMap: {
      0: '拒绝授权',
      1: '已授权',
      2: '未授权'
    },
    showPayTips: false,
    apiUrl: apiUrl
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
        this.payResult = payResult
        this.getList()
      })
  },

  // tab切换
  onTabChange(e) {
    this.setData({ activeIndex: e.detail.index })
    this.setShowList()
  },

  // 设置显示的列表
  setShowList() {
    const showList = this.list.filter(a => a.houseType === this.data.activeIndex)
    this.setData({
      showList: showList,
      showPayTips: showList.findIndex(a => a.status === '1') > -1 && (this.payResult === '0' || this.payResult === '2' || this.payResult === '3')
    })
  },

  // 获取列表
  getList() {
    showLoading('加载中...')
    request({
      url: apiUrl + 'house/records',
      data: {
        access_token: this.access_token
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        this.list = data.data.map(item => {
          return {
            ...item,
            status: item.status || '2',
            start_time: formatTime(item.start_time),
            end_time: formatTime(item.end_time)
          }
        })
        this.setShowList()
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
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
    if (this.payResult !== '1' || item.status !== '1') return
    wx.navigateTo({
      url: '../house/self-house?houseId=' + item.houseId
    })
  }
})

// 格式化时间
function formatTime(time) {
  return time.substring(6, 16)
}
