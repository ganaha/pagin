/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/**
 * Paginaper
 *
 * @author ganaha
 */
var Pagin = function (callback, options) {
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
        _load: function () {
            var _this = this;
            _this.isLoading = true;
            callback({
                limit: _this.limit,
                offset: _this.offset,
                sort: _this.sort,
                order: _this.order,
                keyword: _this.keyword
            }, function (res) {
                _this.isLoading = false;
                _this.records = _this._getSubdata(res, _this.recordsKey, []);
                _this.totalCount = _this._getSubdata(res, _this.totalCountKey, 0);
            }, function (e) {
                _this.isLoading = false;
            });
        },
        /**
         * 前ページの存在有無
         */
        hasPrev: function () {
            return !isNaN(this.offset) && this.offset > 0;
        },
        /**
         * 次ページの存在有無
         */
        hasNext: function () {
            if (isNaN(this.offset) || !(this.records instanceof Array) || isNaN(this.totalCount)) return false;
            return Number(this.offset) + this.records.length < this.totalCount;
        },
        /**
         * 全ページ数
         */
        totalPage: function () {
            return Math.ceil(this.totalCount / parseInt(this.limit));
        },
        /**
         * 指定ページへ
         */
        toPage: function (optPage) {
            let page = isNaN(optPage) || optPage < 1 ? 1 : optPage;
            this.offset = (page - 1) * parseInt(this.limit);
            this._load();
            this.currentPage = page;
        },
        /**
         * 前ページへ
         */
        prev: function () {
            if (this.hasPrev()) {
                this.offset -= parseInt(this.limit);
                this._load();
                this.currentPage--;
            }
        },
        /**
         * 次ページ
         */
        next: function () {
            if (this.hasNext()) {
                this.offset += parseInt(this.limit);
                this._load();
                this.currentPage++;
            }
        },
        /**
         * ページネーションの表示ページ
         */
        range: function () {
            let range = isNaN(this.rangePages) || this.rangePages < 3 ? 3 : this.rangePages; // 表示ページ番号の数
            let total = this.totalPage();
            let current = this.currentPage;
            var min = current - Math.floor(range / 2);
            var max = current + Math.floor(range / 2);
            if (min <= 1) {
                min = 1;
                max = min + range - 1 < total ? min + range - 1 : total;
            } else if (total <= max) {
                min = total - range + 1 < 1 ? 1 : total - range + 1;
                max = total;
            }
            return Array.from(Array(max - min + 1), (v, i) => i + min);
        },
        /**
         * 指定キーでソートする。
         */
        sortBy: function (key) {
            this.sort = key;
            this.order = this.order === 'asc' ? 'desc' : 'asc';
            this.toPage(1);
        },
        /**
         * 指定キーでソートする場合の並び順。
         */
        orderBy: function (key) {
            return this.sort === key ? this.order : '';
        },
        /**
         * dataに対して、ドットパス式でアクセスする。
         */
        _getSubdata: function (data, path, defaultValue) {
            var val = data;
            var segments = path.split('.');
            for (let i = 0; i < segments.length; i++) val = val[segments[i]];
            return val || defaultValue;
        }
    };
    // オプション値を反映
    let paginator = Object.assign({}, defaultOptions, options || {});
    // 初回読み込み
    paginator._load();
    return paginator;
};
/* harmony default export */ __webpack_exports__["default"] = (Pagin);
window.Pagin = Pagin;

/***/ })
/******/ ]);