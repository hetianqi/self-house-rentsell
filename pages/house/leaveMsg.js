// pages/house/leaveMsg.js

import { request, showLoading, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  
  // 页面数据
  data: {
    leaveMsg: null,
  },

  // 页面加载
  onLoad() {
    app.login()
      .then(({ access_token }) => {
        this.access_token = access_token
      })
    
  }
})