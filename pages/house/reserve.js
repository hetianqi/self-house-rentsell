// pages/house/reserve.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    beginDate: null,
    endDate: null,
    beginTime: '',
    endTime: ''
  },

  /**
   *  生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let now = new Date();
    let beginDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
    
    this.setData({
      beginDate: {
        year: beginDate.getFullYear(),
        month: beginDate.getMonth() + 1,
        day: beginDate.getDate()
      },
      endDate: {
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate()
      }
    });
  },

  // 选择日期
  pickDate(e) {
    this.setData({
      date: e.detail.year + '-' + e.detail.month+ '-' + e.detail.day
    });
    console.log('date', this.data.date);
  },

  // 选择时间
  pickTime(e) {
    let field = e.currentTarget.dataset.type + 'Time';
    this.setData({ [field]: e.detail.value });
    console.log(field, this.data[field]);
  },

  // 确认预约
  submit() {
    if (parseInt(this.data.beginTime.replace(':', '')) >= parseInt(this.data.endTime.replace(':', ''))) {
      wx.showModal({
        title: '提示',
        content: '看房结束时间必须大于开始时间'
      });
    }
  }
});