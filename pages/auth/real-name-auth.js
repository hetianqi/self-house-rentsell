// pages/auth/real-name-auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  // 提交
  submit(e) {
    console.log(e.detail.value);
    wx.navigateTo({
      url: './upload-idcard-photo'
    });
  }
});