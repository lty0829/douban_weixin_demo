var requests = require('../../../requests/request.js');
var utils = require('../../../utils/util.js');
var iconColor = [
  '#42BD56', '#31A040'
];
Page({
  data: {
    toView: "top",
    scrollHeight: 0,
    scrollTop: 0,
    id: null,
    loadidngHidden: false,
    personData: null,
    isShort: false,
    isPerson: false,
    loadingMore: false, //是否正在加载更多
    footerIconColor: iconColor[0], //下拉刷新球初始颜色
  },
  onLoad: function (option) {
    console.log(option)
    this.setData({
      id: option.id
    });
  },
  showShort: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight,
          isShort: true,
          isPerson: false,
          toView: "com"
        });
      }
    })
  },
  hideShort: function (e) {
    this.setData({
      isShort: false,
      isPerson: false,
      scrollHeight: 0,
      toView: "top",
    });
  },
  showPerson: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight,
          isShort: false,
          isPerson: true,
          toView: "com"
        });
      }
    })
  },
  hidePerson: function (e) {
    this.setData({
      isShort: false,
      isPerson: false,
      scrollHeight: 0,
      toView: "top",
    });
  },
  toDetailPage: function (e) {
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../detail?id=' + bid
    });
  },



  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          totalHeight: res.windowHeight
        });
      }
    })
  },
  onReady: function () {
    var id = this.data.id;
    var _this = this;
    requests.requestMoviePerson(
      id,
      {},
      (data) => {
        console.log("id",id)
        console.log("人",data)
        _this.setData({
          personData: data
        });
      }, () => {
        wx.navigateBack();
      }, () => {
        _this.setData({
          loadidngHidden: true
        });
      });
  }

});


function updateRefreshBall() {
  var cIndex = 0;
  var _this = this;
  var timer = setInterval(function () {
    if (!_this.data['loadingMore']) {
      clearInterval(timer);
    }
    if (cIndex >= iconColor.length)
      cIndex = 0;
    _this.setData({ footerIconColor: iconColor[cIndex++] });
  }, 100);
}
