// pages/house/reserve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '2018-4-18',
    beginTime: '',
    endTime: ''
  },

  pickDay() {
    
  },

  // 选择时间
  pickTime(e) {
    let field = e.currentTarget.dataset.type + 'Time';
    this.setData({ [field]: e.detail.value });
  }
});