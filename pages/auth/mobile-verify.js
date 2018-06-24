// pages/auth/mobile-verify.js

import { request, showLoading, showError, showWarning } from '../../libs/util.js'
import { apiUrl } from '../../libs/config.js'

const app = getApp()

Page({
  access_token: '',
  countNumber: 0,

  // 页面数据
  data: {
    date: '2017-10-24',
    index: 1,
    photos: [
      'https://image1.ljcdn.com/hdic-resblock/516a982f-415a-4d88-9932-037e4a07afc1.jpg.1000x.jpg',
      'https://image1.ljcdn.com/hdic-resblock/94920763-0190-4801-b485-9304f1823b4c.jpg.1000x.jpg',
      'https://image1.ljcdn.com/hdic-resblock/18f50205-82ec-4758-a387-ede16fc0266d.jpg.1000x.jpg',
      'https://image1.ljcdn.com/hdic-resblock/12d8eb6d-feb5-489b-8d01-aefaec7ac31e.jpg.1000x.jpg',
      'https://image1.ljcdn.com/hdic-resblock/0ff82154-4013-4330-8455-57593c6ea551.jpg.1000x.jpg'
    ],
    getSmsCodeBtnText: '获取验证码',
    phoneNumber: '',
    smsCode: ''
  },

  onShow() {
    app.login()
      .then(({ access_token, payResult }) => {
        this.access_token = access_token
      })
  },

  // 输入手机号
  onPhoneNumberChange(e) {
    this.setData({ phoneNumber: e.detail.value });
  },

  // 输入验证码
  onSmsCodeChange(e) {
    this.setData({ smsCode: e.detail.value });
  },

  // 获取验证码
  getSmsCode() {
    if (!/\d{11}/.test(this.data.phoneNumber)) {
      showWarning('请输入正确的手机号码')
      return
    }
    this.countNumber = 60
    this.countDownGetSmsCode()
    request({
      url: apiUrl + 'user/smsCode',
      data: {
        access_token: this.access_token,
        type: '1',
        codeType: '1',
        phone: this.data.phoneNumber
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.showToast({
          title: '发送成功'
        })
      })
      .catch((err) => {
        this.countNumber = 0
        showError(err)
      })
  },

  countDownGetSmsCode() {
    if (this.countNumber === 0) {
      this.setData({
        getSmsCodeBtnText: '发送验证码'
      })
      return
    }
    setTimeout(() => {
      this.countNumber--
      this.setData({
        getSmsCodeBtnText: this.countNumber + '后可发送'
      })
      this.countDownGetSmsCode()
    }, 1000)
  },

  login() {
    if (!/\d{11}/.test(this.data.phoneNumber)) {
      showWarning('请输入正确的手机号码')
      return
    }
    if (!/\d{4}/.test(this.data.smsCode)) {
      showWarning('请输入4位验证码')
      return
    }
    showLoading('登录中...')
    request({
      url: apiUrl + 'user/checkCode',
      method: 'POST',
      data: {
        access_token: this.access_token,
        phone: this.data.phoneNumber,
        codeType: '1',
        verifycode: this.data.smsCode
      }
    })
      .then((data) => {
        if (data.code !== '200') {
          throw new Error(data.msg)
        }
        wx.hideLoading()
        app.globalData.phoneNumber = this.data.phoneNumber
        wx.navigateTo({
          url: './real-name-auth?houseId=' + this.data.houseId
        })
      })
      .catch(err => {
        wx.hideLoading()
        showError(err)
      })
  }
});