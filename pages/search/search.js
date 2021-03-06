var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');

//刷新动态球颜色
var iconColor = [
  '#42BD56', '#31A040'
];

Page({
  data: {
    scrollHeight: 0, //scroll-view高度
    pageIndex: 0, //页码
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    footerIconColor: iconColor[0], //下拉刷新球初始颜色
    pageData: [], //图书数据
    searchKey: null, //搜索关键字
    hotkey: [{ "k": "美丽人生", "n": "1292063" }, { "k": "三傻大闹宝莱坞", "n": "3793023" }, { "k": "乱世佳人", "n": "1300267" }, { "k": "至暗时刻", "n": "26761416" }, { "k": "乾坤福寿镜", "n": "27005363" },],
    searchHotShow: true, 
    specialkey:true
  },


  onHotSearch: function (ev) {
    var info = ev.target.dataset.id;
    console.log(info)
    wx.navigateTo({
      url: '../detail/detail?id=' + info
    });
  },

  //页面显示获取设备屏幕高度，以适配scroll-view组件高度
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
        });
      }
    })
  },

  //搜索输入框输入取值
  searchInputEvent: function (e) {
    this.setData({ searchKey: e.detail.value,
      searchHotShow:false });
    console.log(e.detail.value)
    if (e.detail.value.length==0){
      this.setData({searchHotShow:true })
    }
  },

  //搜索按钮点击事件
  searchClickEvent: function (e) {
    if (!this.data.searchKey) {
      return;
    }
    this.setData({ pageIndex: 0, pageData: [], searchHotShow:false });
    requestData.call(this);
  },

  //下拉请求数据
  scrollLowerEvent: function (e) {
    if (this.data.loadingMore)
      return;
    requestData.call(this);
  },

  //跳转到详细页面
  toDetailPage: function (e) {
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../detail/detail?id=' + bid
    });
  }

});

/**
 * 请求图书信息
 */
function requestData() {
  var _this = this;
  var q = this.data.searchKey;
  var start = this.data.pageIndex;

  this.setData({ loadingMore: true, isInit: false });
  updateRefreshBall.call(this);
  console.log(q,start)
  requests.requestSearchMovie({ q: q, start: start } ,(data) => {
    if (data.total == 0) {
      //没有记录
      _this.setData({ totalRecord: 0 });
    } else {
      console.log(data.subjects);
      _this.setData({
        pageData: _this.data.pageData.concat(data.subjects),
        pageIndex: start + 1,
        totalRecord: data.total
      });
    }
  }, () => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ loadingMore: false });
  });
}

/**
 * 刷新下拉效果变色球
 */
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
