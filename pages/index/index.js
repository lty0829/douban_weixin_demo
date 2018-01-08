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
    navbar: ['正在热映', '即将上映', 'Top250'],
    currentTab: 0,
    scrollLeft: 0,
  },
  navbarTap: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var tidx = this.data.currentTab;
    if (tidx != idx) {
    this.setData({
      currentTab: idx,
      pageIndex: 0, //页码
      totalRecord: 0, //图书总数
      isInit: true, //是否第一次进入应用
      loadingMore: false, //是否正在加载更多
      footerIconColor: iconColor[0], //下拉刷新球初始颜色
      pageData: [], //图书数据
      searchKey: null, //搜索关键字
      scrollLeft: 0,
    })
   
      if (idx == 0) {
        requestData.call(this);
      }
      else if(idx==1){
        requestData1.call(this);
      }
      else{
        requestData2.call(this);
      }
    }
  },  
  switchTab: function (e) {
    var idx = e.detail.current;
    var tidx = this.data.currentTab;
    console.log(idx,tidx);
    if (tidx != idx) {
    this.setData({
      currentTab: idx,
      pageIndex: 0, //页码
      totalRecord: 0, //图书总数
      isInit: true, //是否第一次进入应用
      loadingMore: false, //是否正在加载更多
      footerIconColor: iconColor[0], //下拉刷新球初始颜色
      pageData: [], //图书数据
      searchKey: null, //搜索关键字
    });
   
      if (idx == 0) {
        requestData.call(this);
      }
      else if (idx == 1) {
        requestData1.call(this);
      }
      else {
        requestData2.call(this);
      }
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。







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

  //下拉请求数据
  scrollLowerEvent: function (e) {
    if (this.data.loadingMore)
      return;
    var idx = this.data.currentTab;
    if (idx == 0) {
      requestData.call(this);
    }
    else if (idx == 1) {
      requestData1.call(this);
    }
    else {
      requestData2.call(this);
    }
   
  },

  //跳转到详细页面
  toDetailPage: function (e) {
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../detail/detail?id=' + bid
    });
  },
  onLoad: function () {
    requestData.call(this);
  }

});

/**
 * 请求图书信息
 */
function requestData() {
  var _this = this;
  var start = this.data.pageIndex;
  this.setData({ loadingMore: true, isInit: false });
  updateRefreshBall.call(this);
  requests.requestMovieIntheaters({ start: start},(data)=>{
    if (data.total == 0) {
      //没有记录
      _this.setData({ totalRecord: 0 });
    } else {
      console.log('请求异常', data);
      _this.setData({
        
        pageData: _this.data.pageData.concat(data.subjects),
        pageIndex: start + 1,
        totalRecord: data.total
      });
    }
  } ,() => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ loadingMore: false });
  });
}
function requestData1() {
  var _this = this;
  var start = this.data.pageIndex;
  this.setData({ loadingMore: true, isInit: false });
  updateRefreshBall.call(this);
  requests.requestMovieComing({ start: start}, (data) => {
    if (data.total == 0) {
      //没有记录
      _this.setData({ totalRecord: 0 });
    } else {
      console.log('请求异常', data);
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

function requestData2() {
  var _this = this;
  var start = this.data.pageIndex;
  this.setData({ loadingMore: true, isInit: false });
  updateRefreshBall.call(this);
  requests.requestMovieRec({ start: start}, (data) => {
    if (data.total == 0) {
      //没有记录
      _this.setData({ totalRecord: 0 });
    } else {
      console.log('请求异常', data);
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
