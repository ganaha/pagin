/**
 * Paginaper
 *
 * @author ganaha
 */
export default function(callback, options) {
    var defaultOptions = {
        limit: 5, // 表示件数
        offset: 0, // 開始位置
        rangePages: 5, // ページ数(3以上であること)
        currentPage: 1, // 現在のページ
        isLoading: false, // Loading表示制御
        sort: 'id', // ソート項目
        order: 'desc', // 並び順(asc or desc)
        keyword: '', // 検索(フィルタ)ワード
        records: [], // レコード
        recordsKey: 'records', // レスポンスの表示レコードのkey名(ドットパス式OK)
        totalCount: 0, // 全件数
        totalCountKey: 'totalCount', // レスポンスの表示全件数のkey名(ドットパス式OK)
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
                _this.records = _this._getSubdata(res, _this.recordsKey, [])
                _this.totalCount = _this._getSubdata(res, _this.totalCountKey, 0)
            }, function(e) {
                _this.isLoading = false
            })
        },
        /**
         * 前ページの存在有無
         */
        hasPrev: function() {
            return !isNaN(this.offset) && this.offset > 0
        },
        /**
         * 次ページの存在有無
         */
        hasNext: function() {
            if (isNaN(this.offset) || !(this.records instanceof Array) || isNaN(this.totalCount)) return false
            return (Number(this.offset) + this.records.length) < this.totalCount
        },
        /**
         * 全ページ数
         */
        totalPage: function() {
            return Math.ceil(this.totalCount / parseInt(this.limit))
        },
        /**
         * 指定ページへ
         */
        toPage: function(optPage) {
            let page = (isNaN(optPage) || optPage < 1) ? 1 : optPage
            this.offset = (page - 1) * parseInt(this.limit)
            this._load()
            this.currentPage = page
        },
        /**
         * 前ページへ
         */
        prev: function() {
            if (this.hasPrev()) {
                this.offset -= parseInt(this.limit)
                this._load()
                this.currentPage--
            }
        },
        /**
         * 次ページ
         */
        next: function() {
            if (this.hasNext()) {
                this.offset += parseInt(this.limit)
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
            } else if (total <= max) {
                min = (total - range + 1) < 1 ? 1 : (total - range + 1)
                max = total
            }
            return Array.from(Array(max - min + 1), (v, i) => i + min)
        },
        /**
         * 指定キーでソートする。
         */
        sortBy: function(key) {
            this.sort = key
            this.order = this.order === 'asc' ? 'desc' : 'asc'
            this.toPage(1)
        },
        /**
         * 指定キーでソートする場合の並び順。
         */
        orderBy: function(key) {
            return this.sort === key ? this.order : ''
        },
        /**
         * dataに対して、ドットパス式でアクセスする。
         */
        _getSubdata: function(data, path, defaultValue) {
            var val = data
            var segments = path.split('.')
            for (let i = 0; i < segments.length; i++) val = val[segments[i]]
            return val || defaultValue
        }
    }
    // オプション値を反映
    let paginator = Object.assign({}, defaultOptions, options || {})
    // 初回読み込み
    paginator._load()
    return paginator
}
