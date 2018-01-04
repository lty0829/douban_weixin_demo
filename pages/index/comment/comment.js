var requests = require('../../../requests/request.js');
var num=0;
Page({
  data: {
    scrollHeight: 0,
    comLen: 0,
    collMovie: [],
    iscollect: false,
  },
  onLoad: function (option) {
    var value = wx.getStorageSync("comment")
    if (value) {
      if (value.length != 0) {
        this.setData({
          iscollect: true,
          comLen: value.length
        });
        var _this = this;
        for (var i = 0; i < value.length; i++) {
          requests.requestMovieDokDetail(
            value[i].id,
            {},
            (data) => {              
              var newData = _this.data.collMovie;
              data["src"] = value[num].src;
              num = num+1;
              newData.push(data);
              _this.setData({
                collMovie: newData
              });
            }, () => {
              wx.navigateBack();
            }, () => {
              _this.setData({
                loadidngHidden: true
              });
            });
        }

      }
    }
  },
  toDetailPage: function (e) {
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../../detail/detail?id=' + bid
    });
  },
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          scrollHeight: res.windowHeight
        });
      }
    })
  },
});