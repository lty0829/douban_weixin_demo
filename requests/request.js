var api = require('./api.js');
var utils = require('../utils/util.js');

/**
 * 网路请求
 */
function request(url, data, successCb, errorCb, completeCb) {
  wx.request({
    url: url,
    method: 'GET',
    data: data,
    header: { 'content-type': 'json'},
    success: function (res) {
      if (res.statusCode == 200){
        utils.isFunction(successCb) && successCb(res.data);
      }
      else{
        console.log('请求异常', res);
      }
    },
    error: function () {
      utils.isFunction(errorCb) && errorCb();
    },
    complete: function () {
      utils.isFunction(completeCb) && completeCb();
    }
  });
}

/**
 * 搜索图书
 */
function requestSearchMovie(data, successCb, errorCb, completeCb) {
  request(api.API_MOVIE_SEARCH, data, successCb, errorCb, completeCb);
}

/**
 * 获取图书详细信息
 */
function requestMovieDokDetail(id, data, successCb, errorCb, completeCb) {
  request(api.API_MOVIE_DETAIL.replace(':id', id), data, successCb, errorCb, completeCb);
}

function requestMovieIntheaters(data, successCb, errorCb, completeCb){
  request(api.API_MOVIE_IN_THEATERS, data, successCb, errorCb, completeCb);
}
function requestMovieComing(data, successCb, errorCb, completeCb) {
  request(api.API_MOVIE_COMING, data, successCb, errorCb, completeCb);
}

function requestMovieRec(data, successCb, errorCb, completeCb) {
  request(api.API_MOVIE_REC, data, successCb, errorCb, completeCb);
}
function requestMoviePerson(id, data, successCb, errorCb, completeCb) {
  request(api.API_MOVIE_PERSON.replace(':id', id), data, successCb, errorCb, completeCb);
}


/**
 * 关键字是否是tag
 */
function requestHasTag(tag, successCb, errorCb, completeCb) {
  request(api.API_MOVIE_SEARCH, { tag: tag, count: 1 }, successCb, errorCb, completeCb);
}

module.exports = {
  requestSearchMovie: requestSearchMovie,
  requestMovieDokDetail: requestMovieDokDetail,
  requestMovieIntheaters: requestMovieIntheaters,
  requestMovieRec: requestMovieRec,
  requestMoviePerson: requestMoviePerson,
  requestMovieComing: requestMovieComing
}
