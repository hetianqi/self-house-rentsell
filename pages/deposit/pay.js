// pages/apply/pay-deposit.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  // 立即支付
  requestPayment() {
    var self = this;

    if (this.data.loading) return;
    
    self.setData({ loading: true });
    setTimeout(() => {
      self.setData({ loading: false });
      wx.navigateTo({
        url: './pay-result?result=' + (Math.random() < 0.5 ? 0 : 1),
      });
    }, 1000);
    return;
    wx.request({
      url: paymentUrl,
      data: {
        openid
      },
      method: 'POST',
      success: function (res) {
        console.log('unified order success, response is:', res)
        var payargs = res.data.payargs
        wx.requestPayment({
          timeStamp: payargs.timeStamp,
          nonceStr: payargs.nonceStr,
          package: payargs.package,
          signType: payargs.signType,
          paySign: payargs.paySign
        })

        self.setData({
          loading: false
        })
      }
    });
  }
});