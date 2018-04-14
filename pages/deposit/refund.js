// pages/deposit/refund.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    photoSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 上传照片
  uploadPhoto() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      success({ tempFilePaths }) {
        _this.setData({ photoSrc: tempFilePaths[0] });
      }
    });
  },

  // 确认退款
  confirmRefund() {
    if (!this.data.photoSrc) {
      wx.showModal({
        title: '提示',
        content: '请上传关门照片'
      });
      return;
    }    
  }
});