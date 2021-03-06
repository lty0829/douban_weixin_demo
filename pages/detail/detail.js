var requests = require('../../requests/request.js');
var utils = require('../../utils/util.js');
var iconColor = [
  '#42BD56', '#31A040'
];
Page({
  data: {
    toView: "top",
    scrollHeight: 0,
    scrollTop:0,
    id: null,
    loadidngHidden: false,
    movieData: null,
    isShort:false,
    isPerson:false,
    loadingMore: false, //是否正在加载更多
    footerIconColor: iconColor[0], //下拉刷新球初始颜色
    imgUrl:"../../imgs/AtiAi1.png",
    collId:[],
    iscollect:false,
    comment: "",
    commentKey:""
  },
  onLoad: function (option) {
    console.log(option)
    this.setData({
      id: option.id
    });

    var value = wx.getStorageSync("collect")
    if (!value) {
      wx.setStorageSync('collect', this.data.collId);
    }
    else{
      Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
          if (this[i] === obj) {
            return true;
          }
        }
        return false;  
      }
      if (value.contains(this.data.id)){
        this.setData({
          imgUrl: "../../imgs/AtiAi2.png",
          iscollect:true
        });
      }
    }
    var comment = wx.getStorageSync("comment")
    if(!comment){
      wx.setStorageSync('comment', []);
    }
    else{
        var i = comment.length;
        while (i--) {
          if (comment[i].id === this.data.id) {
            this.setData({
              comment:comment[i].src,
            })
          }
        }
    }
  },

  searchInputEvent: function (e) {
    this.setData({
      commentKey: e.detail.value,
    });

  },

  handleComfirm: function (event) {
    if(this.data.commentKey.length!=0){
      var id = this.data.id;
      var comment = wx.getStorageSync("comment")
      var iscom = true;
      var i = comment.length;
      while (i--) {
        if (comment[i].id === id&&iscom) {
            iscom = false;
            comment[i].src = this.data.commentKey;
            wx.setStorageSync('comment', comment);
        }
      }
      if(iscom){
        comment.push({"id":id,"src":this.data.commentKey});
        wx.setStorageSync('comment', comment);
      }
      console.log(comment);
      wx.showToast({
        title: '评论成功',
        icon: 'success',
        duration: 2000
      })
    }
    else{
      wx.showToast({
        title: '不能为空',
        icon: 'fail',
        duration: 2000
      })
    }

    
  },


  getCollect:function(e){
    var value = wx.getStorageSync("collect")
    if(this.data.iscollect){
      Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      value.remove(this.data.id);
      wx.setStorageSync('collect', value);
      this.setData({
        imgUrl: "../../imgs/AtiAi1.png",
        iscollect: false
      });
    }else{
      value.push(this.data.id); 
      wx.setStorageSync('collect', value);
      this.setData({
        imgUrl: "../../imgs/AtiAi2.png",
        iscollect: true
      });
    }
    console.log(value)
  },
  showShort:function(e){
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            scrollHeight: res.windowHeight,
            isShort: true,
            isPerson:false,
            toView: "com"
          });
        }
      })
  },
  hideShort:function(e){
    this.setData({
      isShort:false,
      isPerson: false,
      scrollHeight:0,
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
  toPersonPage: function (e) {
    var bid = e.currentTarget.dataset.bidx; //图书id [data-bid]
    wx.navigateTo({
      url: 'celebrity/celebrity?id=' + bid
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
    requests.requestMovieDokDetail(
      id,
      {  },
      (data) => {
        console.log(data)
        _this.setData({
          movieData: data
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
