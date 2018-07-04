// pages/pay-deposit/pay-deposit-result.js

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    result: null
  },

  // 页面加载
  onLoad(options) {
    this.setData({ result: +options.result })
    app.globalData.loginData = null
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
      })
  },

  // 去看房，跳转到我的申请
  toHouse() {
    wx.navigateTo({
      url: '../house/apply'
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