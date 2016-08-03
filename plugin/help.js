var fs = require('fs')
  , path = require('path');

function help(req, cb) {
  var conf = req.conf
    , file = conf.file;
  if(this.help === true && file) {
    print(file, req, function() {
      req.abort();
    });
  }else{
    cb();
  }
}

function print(file, req, cb) {
  if(req.runtime.base) {
    file = path.join(req.runtime.base, file);
  }

  /* istanbul ignore next: never use stdout in test env */
  var output = req.conf && req.conf.output
      ? req.conf.output : process.stdout
    , input = fs.createReadStream(file);

  input.once('open', function() {
    input.pipe(output);

    if(typeof cb === 'function') {
      /* istanbul ignore else: never use stdout in test env */
      if(output !== process.stdout) {
        output.once('finish', cb);
      }else{
        input.once('end', cb);
      }
    }
  });
}

help.print = print;

module.exports = help;
