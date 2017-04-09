# pagin
A simple javascript library for single page application(SPA).

## Installation

```
npm install --save pagin
```

## Usage

- js

```
import Pagin from 'pagin'
var callback = function(params, success, failure) {
    // ajax
}
var pagin = new Pagin(callback)
```

or

```
・・・
var options = {
    rangePages: 7,
    limit: 10,
    recordsKeyName: 'records',
    totalCountKeyName: 'totalCount'
}
var pagin = new Pagin(callback, options)
```

- html
  - Vue.js2

```

```




## Options

| key               |   default    | description     |
|:------------------|:------------:|:----------------|
| limit             |      5       |                 |
| rangePages        |      5       |                 |
| recordsKeyName    |  'records'   |                 |
| totalCountKeyName | 'totalCount' |                 |
| sort              |     'id'     |                 |
| order             |    'desc'    | 'asc' or 'desc' |

## API
