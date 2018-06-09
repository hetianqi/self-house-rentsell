// pages/auth/verify.js

import { request, showError } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  
  // 页面数据
  data: {
    houseId: '',
    houseImgs: [],
    currHouseImgIndex: 0,
    resourcesURI: ''
  },

  // 页面加载
  onLoad(options) {
    console.log(options)
    this.setData({
      houseId: options.houseId,
      houseImgs: app.globalData.houseImgs,
      resourcesURI: app.globalData.resourcesURI
    })
  },

  // 照片切换
  onHouseImgSwipe(e) {
    console.log(e.detail)
    this.setData({
      currHouseImgIndex: e.detail.current
    })
  },
  
  // 微信登录
  wechatLogin() {
    console.log(arguments);
  }
})