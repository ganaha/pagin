/**
 * Paginaper
 *
 * @author ganaha
 */
export default function(callback, options) {
  var defaultOptions = {
    rangePages: 5, // ページ数(3以上であること)
    limit: 5, // 表示件数
    offset: 0, // 開始位置
    sort: 'id', // ソート項目
    order: 'desc', // 並び順(asc or desc)
    isLoading: false, // Loading表示制御
    recordsKeyName: 'data.records', // レスポンスの表示レコードのkey名(ドットパス式OK)
    records: [], // レコード
    totalCountKeyName: 'total.count', // レスポンスの表示全件数のkey名(ドットパス式OK)
    totalCount: 0, // 全件数
    currentPage: 1, // 現在のページ
    columns: ['id', 'email', 'created', 'updated'], // ヘッダ
    keyword: '', // 検索(フィルタ)ワード
    /**
     * ページ読み込み
     */
    _load: function() {
      var _this = this
      _this.isLoading = true
      callback({
        limit: _this.limit,
        offset: _this.offset,
        sort: _this.sort,
        order: _this.order,
        keyword: _this.keyword
      }, function(res) {
        _this.isLoading = false
        _this.records = _this._getSubdata(res, _this.recordsKeyName)
        _this.totalCount = _this._getSubdata(res, _this.totalCountKeyName)
      }, function(e) {
        _this.isLoading = false
        console.log(e)
      })
    },
    /**
     * 前ページの存在有無
     */
    hasPrev: function() {
      return this.offset !== 0
    },
    /**
     * 次ページの存在有無
     */
    hasNext: function() {
      return (this.offset + this.records.length) < this.totalCount
    },
    /**
     * 全ページ数
     */
    totalPage: function() {
      return Math.ceil(this.totalCount / this.limit)
    },
    /**
     * 指定ページへ
     */
    toPage: function(optPage) {
      let page = (isNaN(optPage) || optPage < 1) ? 1 : optPage
      this.offset = (page - 1) * this.limit
      this._load()
      this.currentPage = page
    },
    /**
     * 前ページへ
     */
    prev: function() {
      if (this.hasPrev()) {
        this.offset -= this.limit
        this._load()
        this.currentPage--
      }
    },
    /**
     * 次ページ
     */
    next: function() {
      if (this.hasNext()) {
        this.offset += this.limit
        this._load()
        this.currentPage++
      }
    },
    /**
     * ページネーションの表示ページ
     */
    range: function() {
      let range = (isNaN(this.rangePages) || this.rangePages < 3) ? 3 : this.rangePages // 表示ページ番号の数
      let total = this.totalPage()
      let current = this.currentPage
      var min = current - Math.floor(range / 2)
      var max = current + Math.floor(range / 2)
      if (min <= 1) {
        min = 1
        max = (min + range - 1) < total ? (min + range - 1) : total
      } else if (total < max) {
        min = (total - range + 1) < 1 ? 1 : (total - range + 1)
        max = total
      }
      console.log("min:%s, current: %s, max:%s", min, current, max)
      return Array.from(Array(range), (v, i) => i + min)
    },
    sortBy: function(key) {
      this.sort = key
      this.order = this.order === 'asc' ? 'desc' : 'asc'
      this.toPage(1)
    },
    orderBy: function(key) {
      return this.sort === key ? this.order : ''
    },
    _getSubdata: function(data, path) {
      var val = data
      var segments = path.split('.')
      for (let i = 0; i < segments.length; i++) val = val[segments[i]]
      return val;
    }
  }
  // オプション値を反映
  let paginator = Object.assign({}, defaultOptions, options || {})
  // 初回読み込み
  paginator._load()
  return paginator
}
