//app.js

import { request, showLoading, showError } from './libs/util.js'
import { apiUrl } from './libs/config.js'

App({
  login(callback) {
    return new Promise((resolve, reject) => {
      if (this.globalData.loginData) {
        resolve(this.globalData.loginData)
        return
      }
      showLoading('加载中...')
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
            data: {
              code: code
            }
          })
            .then((data) => {
              wx.hideLoading()
              if (data.code !== '200') {
                throw new Error(data.msg)
              }
              this.globalData.loginData = data.data
              resolve(this.globalData.loginData)
            })
            .catch((err) => {
              wx.hideLoading()
              showError(err)
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
    // 用户登录数据
    loginData: null,
    // 房源图片
    houseImgs: [],
    // 房源图片url前缀
    resourceURI: '',
    // 用户手机号
    phoneNumber: '17780514632'
  }
})
