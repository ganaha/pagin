import Pagin from '../index'

describe('Pagin index.js テスト', function() {

    describe('pagin._load', function() {
        it('正常系 - optionsの設定値がcallbackに渡っていること', function() {
            var callback = function(params, success, failure) {
                expect(params.limit).toBe(999)
                expect(params.offset).toBe(888)
                expect(params.sort).toBe('test')
                expect(params.order).toBe('asc')
                expect(params.keyword).toBe('keyword')
                success({records: 'success', totalCount: 777})
            }
            var options = {
                limit: 999,
                offset: 888,
                sort: 'test',
                order: 'asc',
                keyword: 'keyword'
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.isLoading).toBe(false)
            expect(pagin.records).toBe('success')
            expect(pagin.totalCount).toBe(777)
        })

        it('異常系 - callback 処理で失敗した場合、isLoading が false になっていること', function() {
            var callback = function(params, success, failure) {
                failure()
            }
            var pagin = new Pagin(callback)
            expect(pagin.isLoading).toBe(false)
        })

    })

    describe('pagin.hasPrev()', function() {
        var callback = function(params, success, failure) {
            success('success')
        }
        it('offset が 0 の場合、 false になること', function() {
            var pagin = new Pagin(callback)
            pagin.offset = 0
            expect(pagin.hasPrev()).toBe(false)
        })

        it('offset が 1 の場合、 true になること', function() {
            var pagin = new Pagin(callback)
            pagin.offset = 1
            expect(pagin.hasPrev()).toBe(true)
        })

        it('offset が -1 の場合、 false になること', function() {
            var pagin = new Pagin(callback)
            pagin.offset = -1
            expect(pagin.hasPrev()).toBe(false)
        })

        it('offset が "a" の場合、 false になること', function() {
            var pagin = new Pagin(callback)
            pagin.offset = 'a'
            expect(pagin.hasPrev()).toBe(false)
        })

        it('offset が "1" の場合、 false になること', function() {
            var pagin = new Pagin(callback)
            pagin.offset = '1'
            expect(pagin.hasPrev()).toBe(true)
        })

        it('offset が true の場合、 true になること', function() {
            var pagin = new Pagin(callback)
            pagin.offset = true
            expect(pagin.hasPrev()).toBe(true)
        })

        it('offset が false の場合、 false になること', function() {
            var pagin = new Pagin(callback)
            pagin.offset = false
            expect(pagin.hasPrev()).toBe(false)
        })

    })

    describe('pagin.hasNext()', function() {
        var callback = function(params, success, failure) {
            success('success')
        }
        var pagin = new Pagin(callback)

        it('offset = 9, records = 0, totalCount = 10 の場合、 true になること', function() {
            pagin.offset = 9
            pagin.records = []
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(true)
        })

        it('offset = 9, records = 1, totalCount = 10 の場合、 false になること', function() {
            pagin.offset = 9
            pagin.records = [1]
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = "9", records = 0, totalCount = 10 の場合、 true になること', function() {
            pagin.offset = "9"
            pagin.records = []
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(true)
        })

        it('offset = "a", records = 0, totalCount = 10 の場合、 false になること', function() {
            pagin.offset = "a"
            pagin.records = []
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = null(0), records = 0, totalCount = 10 の場合、 true になること', function() {
            pagin.offset = null
            pagin.records = []
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(true)
        })

        it('offset = ""(0), records = 0, totalCount = 10 の場合、 true になること', function() {
            pagin.offset = ""
            pagin.records = []
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(true)
        })

        it('offset = 9, records = 2, totalCount = 10 の場合、 false になること', function() {
            pagin.offset = 9
            pagin.records = [1, 2]
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = 9, records = "aaa", totalCount = 10 の場合、 false になること', function() {
            pagin.offset = 9
            pagin.records = "aaa"
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = 9, records = null, totalCount = 10 の場合、 false になること', function() {
            pagin.offset = 9
            pagin.records = null
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = 9, records = "", totalCount = 10 の場合、 false になること', function() {
            pagin.offset = 9
            pagin.records = ""
            pagin.totalCount = 10
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = 9, records = [], totalCount = "10" の場合、 true になること', function() {
            pagin.offset = 9
            pagin.records = []
            pagin.totalCount = "10"
            expect(pagin.hasNext()).toBe(true)
        })

        it('offset = 9, records = [], totalCount = "aaa" の場合、 true になること', function() {
            pagin.offset = 9
            pagin.records = []
            pagin.totalCount = "aaa"
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = 9, records = [], totalCount = ""(0) の場合、 true になること', function() {
            pagin.offset = 9
            pagin.records = []
            pagin.totalCount = ""
            expect(pagin.hasNext()).toBe(false)
        })

        it('offset = 9, records = [], totalCount = null(0) の場合、 true になること', function() {
            pagin.offset = 9
            pagin.records = []
            pagin.totalCount = null
            expect(pagin.hasNext()).toBe(false)
        })
    })

    describe('pagin.toPage(num)', function() {
        var callback = function(params, success, failure) {
            success({records: [1, 2]})
        }

        it('num = 1, limit = 5 の場合、 currentPage = 1 になること ', function() {
            var pagin = new Pagin(callback)
            pagin.toPage(1)
            expect(pagin.currentPage).toBe(1)
        })

        it('num = 2, limit = 5 の場合、 currentPage = 2 になること ', function() {
            var pagin = new Pagin(callback)
            pagin.toPage(2)
            expect(pagin.currentPage).toBe(2)
        })

        it('num = 0, limit = 5 の場合、 currentPage = 1 になること ', function() {
            var pagin = new Pagin(callback)
            pagin.toPage(0)
            expect(pagin.currentPage).toBe(1)
        })

        it('num = -1, limit = 5 の場合、 currentPage = 1 になること ', function() {
            var pagin = new Pagin(callback)
            pagin.toPage(-1)
            expect(pagin.currentPage).toBe(1)
        })

        it('num = "aaa", limit = 5 の場合、 currentPage = 1 になること ', function() {
            var pagin = new Pagin(callback)
            pagin.toPage("aaa")
            expect(pagin.currentPage).toBe(1)
        })

        it('num = ""(0), limit = 5 の場合、 currentPage = 1 になること ', function() {
            var pagin = new Pagin(callback)
            pagin.toPage("")
            expect(pagin.currentPage).toBe(1)
        })

        it('num = null(0), limit = 5 の場合、 currentPage = 1 になること ', function() {
            var pagin = new Pagin(callback)
            pagin.toPage(null)
            expect(pagin.currentPage).toBe(1)
        })
    })

    describe('pagin.prev()', function() {
        var callback = function(params, success, failure) {
            success({records: [1], totalCount: 3})
        }

        it ('currentPage = 2 の場合、 currentPage = 1 になること', function() {
            var pagin = new Pagin(callback, {limit: 1})
            pagin.toPage(2)
            pagin.prev()
            expect(pagin.currentPage).toBe(1)
        })

        it ('currentPage = 1 の場合、 currentPage = 1 になること', function() {
            var pagin = new Pagin(callback, {limit: 1})
            pagin.toPage(1)
            pagin.prev()
            expect(pagin.currentPage).toBe(1)
        })
    })

    describe('pagin.next()', function() {
        var callback = function(params, success, failure) {
            success({records: [1], totalCount: 3})
        }
        var options = {limit: 1}

        it ('currentPage = 3 の場合、 currentPage = 3 になること', function() {
            var pagin = new Pagin(callback, options)
            pagin.toPage(3)
            pagin.next()
            expect(pagin.currentPage).toBe(3)
        })

        it ('currentPage = 2 の場合、 currentPage = 3 になること', function() {
            var pagin = new Pagin(callback, options)
            pagin.toPage(2)
            pagin.next()
            expect(pagin.currentPage).toBe(3)
        })

        it ('currentPage = 1 の場合、 currentPage = 2 になること', function() {
            var pagin = new Pagin(callback, options)
            pagin.toPage(1)
            pagin.next()
            expect(pagin.currentPage).toBe(2)
        })
    })

    describe('pagin.range()', function() {
        it('range = 1, total = 1, current = 1 の場合、[1] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 1})
            }
            var options = {
                rangePages: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1])
        })

        it('range = 2, total = 1, current = 1 の場合、[1] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 1})
            }
            var options = {
                rangePages: 2
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1])
        })

        it('range = 3, total = 1, current = 1 の場合、[1] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 1})
            }
            var options = {
                rangePages: 3
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1])
        })

        it('range = 0, total = 1, current = 1 の場合、[1] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 1})
            }
            var options = {
                rangePages: 0
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1])
        })

        it('range = "aaa", total = 1, current = 1 の場合、[1] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 1})
            }
            var options = {
                rangePages: "aaa"
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1])
        })

        it('range = null, total = 1, current = 1 の場合、[1] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 1})
            }
            var options = {
                rangePages: "aaa"
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1])
        })

        it('range = 1, limit = 1, total = 10, current = 1 の場合、[1, 2, 3] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 10})
            }
            var options = {
                rangePages: 1,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3])
        })

        it('range = 2, limit = 1, total = 10, current = 1 の場合、[1, 2, 3] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 10})
            }
            var options = {
                rangePages: 2,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3])
        })

        it('range = 3, limit = 1, total = 10, current = 1 の場合、[1, 2, 3] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 10})
            }
            var options = {
                rangePages: 3,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3])
        })

        it('range = 4, limit = 1, total = 10, current = 1 の場合、[1, 2, 3, 4] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 10})
            }
            var options = {
                rangePages: 4,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3, 4])
        })

        it('range = 5, limit = 1, total = 6 4ページまで進むと、[2, 3, 4, 5, 6] となること', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 6})
            }
            var options = {
                rangePages: 5,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5])

            pagin.next() // 2
            expect(pagin.currentPage).toBe(2)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5])

            pagin.next() // 3
            expect(pagin.currentPage).toBe(3)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5])

            pagin.next() // 4
            expect(pagin.currentPage).toBe(4)
            expect(pagin.range()).toEqual([2, 3, 4, 5, 6])
        })

        it('range = 4, limit = 1, total = 6 の場合、next() して挙動が正しいこと', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 6})
            }
            var options = {
                rangePages: 4,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3, 4])

            pagin.next()
            expect(pagin.currentPage).toBe(2)
            expect(pagin.range()).toEqual([1, 2, 3, 4])

            pagin.next()
            expect(pagin.currentPage).toBe(3)
            expect(pagin.range()).toEqual([1, 2, 3, 4])

            pagin.next()
            expect(pagin.currentPage).toBe(4)
            expect(pagin.range()).toEqual([3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(5)
            expect(pagin.range()).toEqual([3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(6)
            expect(pagin.range()).toEqual([3, 4, 5, 6])
        })

        it('range = 6, limit = 1, total = 6 の場合、next() して挙動が正しいこと', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 6})
            }
            var options = {
                rangePages: 6,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(2)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(3)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(4)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(5)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(6)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])
        })

        it('range = 7, limit = 1, total = 6 の場合、next() して挙動が正しいこと', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 6})
            }
            var options = {
                rangePages: 7,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(2)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(3)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(4)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(5)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(6)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5, 6])
        })

        it('range = 5, limit = 1, total = 6 の場合、next()やtoPage() して挙動が正しいこと', function() {
            var callback = function(params, success, failure) {
                success({records: [1], totalCount: 6})
            }
            var options = {
                rangePages: 5,
                limit: 1
            }
            var pagin = new Pagin(callback, options)
            expect(pagin.currentPage).toBe(1)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5])

            pagin.toPage(2)
            expect(pagin.currentPage).toBe(2)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5])

            pagin.next()
            expect(pagin.currentPage).toBe(3)
            expect(pagin.range()).toEqual([1, 2, 3, 4, 5])

            pagin.toPage(4)
            expect(pagin.currentPage).toBe(4)
            expect(pagin.range()).toEqual([2, 3, 4, 5, 6])

            pagin.next()
            expect(pagin.currentPage).toBe(5)
            expect(pagin.range()).toEqual([2, 3, 4, 5, 6])

            pagin.toPage(6)
            expect(pagin.currentPage).toBe(6)
            expect(pagin.range()).toEqual([2, 3, 4, 5, 6])
        })

    })

    describe('pagin.sortBy()', function() {
        var callback = function(params, success, failure) {
            success({records: [], totalCount: 1})
        }

        it('key = "aaa", order = "asc" の場合、 sort = "aaa", order = "desc" に設定されていること', function() {
            var options = {sort: 'name', order: 'asc'}
            var pagin = new Pagin(callback, options)
            pagin.sortBy('aaa')
            expect(pagin.sort).toBe('aaa')
            expect(pagin.order).toBe('desc')
            expect(pagin.currentPage).toBe(1)
        })

        it('key = "bbb", order = "desc" の場合、 sort = "bbb", order = "asc" に設定されていること', function() {
            var options = {sort: 'name', order: 'desc'}
            var pagin = new Pagin(callback, options)
            pagin.sortBy('bbb')
            expect(pagin.sort).toBe('bbb')
            expect(pagin.order).toBe('asc')
            expect(pagin.currentPage).toBe(1)
        })
    })

    describe('pagin.orderBy()', function() {
        var callback = function(params, success, failure) {
            success({records: [], totalCount: 0})
        }

        it('key と sort が同じ場合、 order の値が返却されること(asc)', function() {
            var options = {
                sort: 'aaa',
                order: 'asc'
            }
            var pagin = new Pagin(callback, options)

            expect(pagin.orderBy("aaa")).toBe('asc')
        })

        it('key と sort が同じ場合、 order の値が返却されること(desc)', function() {
            var options = {
                sort: 'aaa',
                order: 'desc'
            }
            var pagin = new Pagin(callback, options)

            expect(pagin.orderBy("aaa")).toBe('desc')
        })

        it('key と sort が異なる場合、 order の値が返却されること(desc)', function() {
            var options = {
                sort: 'aaa',
                order: 'desc'
            }
            var pagin = new Pagin(callback, options)

            expect(pagin.orderBy("bbb")).toBe('')
        })
    })

    describe('pagin._getSubdata(data, path)', function() {
        var callback = function(params, success, failure) {
            success({records: [], totalCount: 0})
        }
        var pagin = new Pagin(callback)

        it('1階層目', function() {
            var data = {first: 'first'}
            var path = 'first'
            expect(pagin._getSubdata(data, path)).toBe('first')
        })

        it('2階層目', function() {
            var data = {first: {second: 'second'}}
            var path = 'first.second'
            expect(pagin._getSubdata(data, path)).toBe('second')
        })

        it('path の data が存在しない場合', function() {
            var data = {first: {second: 'second'}}
            var path = 'third'
            expect(pagin._getSubdata(data, path, 'nothing')).toEqual('nothing')
        })
    })

})
