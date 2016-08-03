# Runtime Plugins

[![Build Status](https://travis-ci.org/mkdoc/mkcli-runtime.svg?v=3)](https://travis-ci.org/mkdoc/mkcli-runtime)
[![npm version](http://img.shields.io/npm/v/mkcli-runtime.svg?v=3)](https://npmjs.org/package/mkcli-runtime)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mkcli-runtime/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mkcli-runtime?branch=master)

> Runtime plugins for command line interfaces

Collection of plugins for command line interfaces defined using the [mkcli][] tool.

## Install

```
npm i mkcli-runtime --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

---

- [Install](#install)
- [API](#api)
  - [load](#load)
  - [run](#run)
- [License](#license)

---

## API

### load

```javascript
load(def[, opts])
```

Load a program definition into a new program assigning the definition
properties to the program.

Properties are passed by reference so if you modify the definition the
program is also modified.

Returns a new program.

* `def` Object the program definition.
* `opts` Object program options.

### run

```javascript
run(src, argv[, runtime], cb)
```

Load a program definition into a new program assigning the definition
properties to the program.

Properties are passed by reference so if you modify the definition the
program is also modified.

The callback function signature is `function(err, req)` where `req` is a
request object that contains state information for program execution.

Plugins may decorate the request object with pertinent information that
does not affect the `target` object that receives the parsed arguments.

Returns a new program.

* `src` Object the source program or definition.
* `argv` Array the program arguments.
* `runtime` Object runtime configuration.
* `cb` Function callback function.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on August 3, 2016

[mkdoc]: https://github.com/mkdoc/mkdoc
[mkast]: https://github.com/mkdoc/mkast
[through]: https://github.com/tmpfs/through3
[commonmark]: http://commonmark.org
[jshint]: http://jshint.com
[jscs]: http://jscs.info

