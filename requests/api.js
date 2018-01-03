const API_BASE = "https://api.douban.com/v2/movie";

module.exports = {
  API_MOVIE_IN_THEATERS: API_BASE + "/in_theaters",
  API_MOVIE_SEARCH: API_BASE + "/search",
  API_MOVIE_DETAIL: API_BASE + "/subject/:id",
  API_MOVIE_REC: API_BASE +"/top250",
  API_MOVIE_PERSON: API_BASE +"/celebrity/:id",
  API_MOVIE_COMING: 　API_BASE +"/coming_soon",
}
