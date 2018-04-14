// pages/pay-deposit/pay-deposit-result.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    house_id: null,
    result: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ result: +options.result });
  },

  // 去看房
  toHouse() {
    wx.navigateTo({
      url: '../house/self-house'
    });
  },

  // 重新支付
  rePayment() {
    wx.navigateBack();
  },

  // 联系我们
  contactUs() {

  }
})