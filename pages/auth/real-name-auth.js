// pages/auth/real-name-auth.js

import { request, showLoading, showError, showWarning } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    apiUrl,
    realName: '',
    idNum: '',
    frontPhotoSrc: '',
    backPhotoSrc: ''
  },

  // 页面显示
  onShow() {
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
      })
  },

  // 文本框输入
  onInput(e) {
    let field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    })
  },

  // 上传照片
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

  // 提交
  submit(e) {
    console.log(this.data)
    if (!app.globalData.phoneNumber) {
      showWarning('手机号码不能为空')
      return
    }
    if (!this.data.realName) {
      showWarning('请输入姓名')
      return
    }
    if (!this.data.idNum) {
      showWarning('请输入身份证号')
      return
    }
    if (!this.data.frontPhotoSrc) {
      showWarning('请上传身份证正面照片')
      return
    }
    if (!this.data.backPhotoSrc) {
      showWarning('请上传身份证背面照片')
      return
    }
    showLoading('实名认证中...')
    request({
      url: apiUrl + 'user/certification',
      method: 'POST',
      data: {
        access_token: this.access_token,
        readName: this.data.realName,
        idNum: this.data.idNum,
        idImg_front: this.data.frontPhotoSrc,
        idImg_back: this.data.backPhotoSrc,
        phone: app.globalData.phoneNumber
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        if (data.data.errcode !== '1') {
          throw new Error(data.data.errmsg)
        }
        app.globalData.loginData = null
        wx.hideLoading()
        wx.navigateTo({
          url: '../house/reserve'
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
      })
  }
})
