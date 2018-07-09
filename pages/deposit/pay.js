// pages/apply/pay-deposit.js

import { request, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    loading: false
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
        if (payResult === '1') {
          wx.redirectTo({
            url: '../house/apply'
          })
        }
      })
  },

  // 支付
  payNow() {
    request({
      url: apiUrl + 'pay/paySign',
      method: 'POST',
      data: {
        access_token: this.access_token,
        payType: 1,
        ip: '192.168.0.12'
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.requestPayment({
          timeStamp: data.data.timestamp,
          nonceStr: data.data.noncestr,
          package: 'prepay_id=' + data.data.prepayid,
          signType: 'MD5',
          paySign: data.data.sign,
          success: () => {
            console.log('支付成功')
            app.globalData.loginData = null
            wx.navigateTo({
              url: './pay-result?result=1',
            })
          },
          fail: ({ errMsg }) => {
            wx.navigateTo({
              url: './pay-result?result=2'
            })
          }
        })
      })
  }
})