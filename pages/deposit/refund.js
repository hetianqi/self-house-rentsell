// pages/deposit/refund.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    apiUrl,
    photoSrc: ''
  },

  // 页面显示
  onShow: function () {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
        if (payResult !== '1') {
          wx.redirectTo({
            url: '../index/index'
          })
        }
      })
  },

  // 上传照片
  uploadPhoto() {
    wx.chooseImage({
      count: 1,
      success: ({ tempFilePaths }) => {
        wx.uploadFile({
          url: apiUrl + 'upload/image',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            access_token: this.access_token,
            modelMap: ''
          },
          success: (({ data, statusCode }) => {
            if (statusCode !== 200 && statusCode !== 304) {
              showError('服务器异常')
              return
            }
            data = JSON.parse(data)
            if (data.code !== '200') {
              showError(data.msg)
              return
            }
            this.setData({ photoSrc: data.imgName[0] })
          })
        })
      }
    })
  },

  // 确认退款
  confirmRefund() {
    showLoading('提交中...')
    request({
      url: apiUrl + 'pay/refund',
      method: 'POST',
      data: {
        access_token: this.access_token,
        imgName: this.data.photoSrc
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        app.globalData.loginData = null
        wx.hideLoading()
        wx.showModal({
          content: '你的退款申请已提交，\r\n请耐心等待！',
          showCancel: false,
          success: () => {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err.message || err)
      })
  }
});