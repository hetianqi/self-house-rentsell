// pages/pay-deposit/pay-deposit-result.js

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    result: null
  },

  // 页面加载
  onLoad: function (options) {
    this.setData({ result: +options.result })
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
      })
  },

  // 去看房
  toHouse() {
    wx.navigateTo({
      url: '../house/self-house'
    })
  },

  // 重新支付
  rePayment() {
    wx.navigateBack()
  },

  // 联系我们
  contactUs() {
    app.getServicePhoneNumber()
      .then(servicePhoneNumber => {
        wx.makePhoneCall({
          phoneNumber: servicePhoneNumber
        })
      })
  }
})