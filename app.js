//app.js

import { showError, request } from './libs/util.js'
import { apiUrl } from './libs/config.js'

App({
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
            showError('登录失败')
            return
          }
          request({
            url: apiUrl + 'user/login',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: code
            }
          })
            .then((data) => {
              wx.hideLoading()
              if (data.code !== '200') {
                showError(data.msg)
                return
              }
              this.globalData.token = data.data.access_token
              resolve(this.globalData.token)
            })
            .catch(() => {
              wx.hideLoading()
            })
        },
        fail: (err) => {
          wx.hideLoading()
          showError('登录失败')
        }
      })
    })
  },
  globalData: {
    token: ''
  }
});