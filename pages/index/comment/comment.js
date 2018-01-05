var requests = require('../../../requests/request.js');
Page({
  data: {
    scrollHeight: 0,
    comLen: 0,
    collMovie: [],
    iscollect: false,
    ismanage:false,
    deleteData:[],
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
              sleep(2000);   
              var newData = _this.data.collMovie;            
              for(var i=0;i<value.length;i++){
                if(value[i].id==data["id"])
                  data["src"] = value[i].src;
              }
              data["check"] = false;
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
  onManage:function(e){
    this.setData({
      ismanage:true,
    })
  },
  deleteTap:function(e){
    var data = this.data.collMovie;
    var value = wx.getStorageSync("comment")
    for (var i = 0; i < data.length; i++) {
      if(data[i].check){
        value.splice(i,1);
        data.splice(i,1);
        i--;
      }
    }
    this.setData({
      collMovie: data,
    })
    wx.setStorageSync('comment', value);
  },

  onFinish:function(e){
    this.setData({
      ismanage:false,
    })
  },

  longTap:function(e){
    this.setData({
      ismanage: true,
    })
  },

  checkboxChange: function (e) {
    var data = this.data.collMovie;
    var value = e.detail.value;
   
    for(var i=0;i<data.length;i++){
      if(value.indexOf(data[i].id)>-1){
        data[i].check = true;
      }
      else{
        data[i].check = false;
      }
    }
    this.setData({
      collMovie: data,
      deleteData: value
    })
  },


  allcheckboxChange:function(e){
    
    var value = e.detail.value;
    var data = this.data.collMovie;
        
        for(var i=0;i<data.length;i++){
          if(value.indexOf("all")>-1)
            data[i]["check"] = true;
          else
            data[i]["check"] = false;
        }
        this.setData({
          collMovie:data
        })
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
 function sleep (numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime)
      return;
  }
}
