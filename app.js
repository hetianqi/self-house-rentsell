//app.js

import { apiUrl } from './libs/config.js';

App({
  onLaunch: function () {
    // this.login()
  },
  login() {
    wx.login({
      success: ({ code }) => {
        wx.showLoading({
          title: '加载中...'
        })
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
            console.log(data)
            this.globalData.token = data.data.access_token
            this.getPremises()
          }
        })
      }
    })
  },
  getPremises() {
    const token = this.globalData.token
    wx.getLocation({
      success: ({ latitude, longitude }) => {
        wx.request({
          url: apiUrl + 'house/premises',
          // header: {
          //   'Content-Type': 'application/x-www-form-urlencoded'
          // },
          data: {
            access_token: token,
            scale: 16,
            lat: latitude,
            lng: longitude
          },
          success: ({ data }) => {
            wx.hideLoading()
            console.log(data)
          }
        })
      }
    });
  },
  globalData: {
    userInfo: null,
    token: ''
  }
});