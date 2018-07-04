// pages/apply/pay-deposit.js

import { request, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  /**
   * 页面的初始数据
   */
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
            wx.navigateTo({
              url: './pay-result?result=1',
            })
          },
          fail: ({ errMsg }) => {
            // if (errMsg === 'requestPayment:fail cancel') return
            wx.navigateTo({
              url: './pay-result?result=2',
            })
          }
        })
      })
  },

  // 立即支付
  requestPayment() {
    var self = this;

    if (this.data.loading) return;
    
    self.setData({ loading: true });
    setTimeout(() => {
      self.setData({ loading: false });
      wx.navigateTo({
        url: './pay-result?result=' + (Math.random() < 0.5 ? 0 : 1),
      });
    }, 1000);
    return;
    wx.request({
      url: paymentUrl,
      data: {
        openid
      },
      method: 'POST',
      success: function (res) {
        console.log('unified order success, response is:', res)
        var payargs = res.data.payargs
        wx.requestPayment({
          timeStamp: payargs.timeStamp,
          nonceStr: payargs.nonceStr,
          package: payargs.package,
          signType: payargs.signType,
          paySign: payargs.paySign
        })

        self.setData({
          loading: false
        })
      }
    });
  }
});