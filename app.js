//app.js

import { apiUrl } from './libs/config.js';

App({
  onLaunch: function () {
    
  },
  login(callback) {
    return new Promise((resolve, reject) => {
      if (this.globalData.token) {
        resolve(this.globalData.token)
        return
      }
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      wx.login({
        success: ({ code }) => {
          if (!code) {
            wx.hideLoading()
            wx.showModal({
              content: '登录失败',
              showCancel: false
            })
            return
          }
          wx.request({
            url: apiUrl + 'user/login',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: code
            },
            success: ({ data }) => {
              wx.hideLoading()
              if (data.code !== '200') {
                wx.showModal({
                  content: data.msg,
                  showCancel: false
                })
                return
              }
              this.globalData.token = data.data.access_token
              resolve(this.globalData.token)
            }
          })
        },
        fail: (err) => {
          wx.hideLoading()
          wx.showModal({
            content: '登录失败',
            showCancel: false
          })
        }
      })
    })
  },
  globalData: {
    token: ''
  }
});