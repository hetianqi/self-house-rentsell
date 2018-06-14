// pages/auth/clause.js

import { request, showLoading, showError, showWarning } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',

  // 页面数据
  data: {
    agreement: ''
  },

  // 页面显示
  onShow: function () {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
        this.getAgreement()
      })
  },

  getAgreement() {
    request({
      url: apiUrl + 'system/agreement',
      data: {
        access_token: this.access_token
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        this.setData({ agreement: data.data })
      })
      .catch((err) => {
        showError(err)
      })
  }
})