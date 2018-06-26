//app.js

import { request, showLoading, showError } from './libs/util.js'
import { apiUrl } from './libs/config.js'

App({
  login() {
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
  getServicePhoneNumber() {
    return new Promise((resolve, reject) => {
      if (this.globalData.servicePhoneNumber) {
        resolve(this.globalData.servicePhoneNumber)
        return
      }
      request({
        url: apiUrl + 'system/servicePhone',
        data: {
          access_token: this.globalData.loginData.access_token
        }
      })
        .then((data) => {
          if (data.code !== '200') {
            throw new Error(data.msg)
          }
          this.globalData.servicePhoneNumber = data.data
          resolve(this.globalData.servicePhoneNumber)
        })
        .catch((err) => {
          showError(err)
        })
    })
  },
  globalData: {
    // 用户登录数据
    loginData: null,
    // 房源Id
    houseId: null,
    // 房源图片
    houseImgs: [],
    // 房源图片url前缀
    resourceURI: '',
    // 用户手机号
    phoneNumber: '17780514632',
    // 客户电话
    servicePhoneNumber: '',
    // 搜索选中结果，供首页地图显示
    searchItem: null
  }
})
