// pages/auth/upload-idcard-photo.js

import { request, showLoading, showError, showWarning } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    apiUrl: apiUrl,
    frontPhotoSrc: '',
    backPhotoSrc: '',
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
      })
  },

  uploadPhoto(e) {
    let field = e.currentTarget.dataset.type + 'PhotoSrc';

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
            this.setData({ [field]: data.imgName[0] })
          })
        })
      }
    })
  },

  // 完成提交
  submit() {



    wx.navigateTo({
      url: '../house/reserve',
    })
  }
});