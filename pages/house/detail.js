// pages/house/detail.js
Page({
  /**
   * 页面的初始数据
   */
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
    detailCollapsed: false
  },

  toggleExpand(e) {
    let field = e.currentTarget.dataset.field;
    this.setData({ [field]: !this.data[field] });
  },
  
  // 申请看房
  apply() {
    wx.navigateTo({
      url: '../auth/verify'
    });
  }
});