// pages/auth/upload-idcard-photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frontPhotoSrc: '',
    backPhotoSrc: ''
  },

  uploadPhoto(e) {
    let field = e.currentTarget.dataset.type + 'PhotoSrc';
    let _this = this;

    wx.chooseImage({
      count: 1,
      success({ tempFilePaths }) {
        _this.setData({ [field]: tempFilePaths[0] });
        console.log(_this.data);
      }
    });
  },

  // 完成提交
  submit() {
    wx.navigateTo({
      url: '../house/reserve',
    })
  }
});