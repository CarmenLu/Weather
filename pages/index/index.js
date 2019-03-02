var app = getApp();
// 引用百度地图微信小程序JSAPI模块 
Page({
  data: {
  },
  onLoad: function () {
    console.log('onLoad');
    var that = this;
    that.getLocation();
  },
  //经纬度
  getLocation:function(){
    var that = this;
    wx.getLocation({
        type:'wgs84',
        success(res){
          var latitude=res.latitude;
          var longtitude=res.longitude;
          console.log('lat：'+latitude+'long:'+longtitude);
          that.getCity(latitude,longtitude); 
        }
    })
    },
    //逆地址解析
    //当前定位城市
    getCity:function(latitude,longtitude){
      var that = this;
      var url ="https://api.map.baidu.com/geocoder/v2/";
      var params={
        ak:"f1h0Tudq2CnFOCvXR9GnvFmSi5peEC2r",
        output:"json",
        location:latitude+","+longtitude
      };
      wx.request({
        url:url,
        data:params,
        success(res){
          var city = res.data.result.addressComponent.city;
          var district=res.data.result.addressComponent.district;
          var street=res.data.result.addressComponent.street;
          console.log(res.data.result);
        that.setData({
          city:city,
          district,district,
          street:street,
        })
        var data=that.data;
        that.getCityWeather(longtitude,latitude);
      
        }
      })
    },
    //当前城市天气
    getCityWeather:function(long,la){
      var that=this;
      var url ="https://free-api.heweather.net/s6/weather";
      var params={
        location: long+","+la,
        key:"43e2e33eee5b47d7a5b41c9e481e1715",
        
      };
      wx.request({
        url:url,
        data:params,
        success(res){

          var nowWeather=res.data.HeWeather6[0].now;
          console.log(nowWeather);
          var daily_forecast=res.data.HeWeather6[0].daily_forecast;
          console.log(daily_forecast);
          that.setData({
            nowtmp:nowWeather.tmp,
            nowwea:{
              cond_code:nowWeather.cond_code,
              cond_txt:nowWeather.cond_txt,
            },
            daily_forecast:daily_forecast
          })
        }
      })
    },
    chooseCity:function(){
      var that=this;
      var isAuthorize;
      wx.getSetting({
        success(res){
console.log(res.authSetting['scope.userLocation']);
var isAuthorize = res.authSetting['scope.userLocation'];
console.log(isAuthorize);
          console.log("success");
          if(!res.authSetting['scope.userLocation']){
            wx.authorize({
              scope:'scope.userLocation',
              success(){
   var isAuthorize = res.authSetting['scope.userLocation'];

            }
          })
        }
          if (isAuthorize) {
            wx.chooseLocation({
              success(res) {
                that.getCity(res.latitude, res.longitude);
                that.getCityWeather(res.longitude, res.latitude);
              },
              fail() {
                console.log("fail");
              }
            })
          }}});
          }

})
  



