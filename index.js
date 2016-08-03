/**
 *  Load a program definition into a new program assigning the definition 
 *  properties to the program.
 *
 *  Properties are passed by reference so if you modify the definition the 
 *  program is also modified.
 *
 *  @function load
 *  @param {Object} def the program definition.
 *  @param {Object} [opts] program options.
 *
 *  @returns a new program.
 */
function load(def) {
  var Program = require('./lib/program')
    , prg = new Program();
  for(var k in def) {
    prg[k] = def[k];
  }
  return prg;
}

/**
 *  Load a program definition into a new program assigning the definition 
 *  properties to the program.
 *
 *  Properties are passed by reference so if you modify the definition the 
 *  program is also modified.
 *
 *  The callback function signature is `function(err, req)` where `req` is a 
 *  request object that contains state information for program execution.
 *
 *  Plugins may decorate the request object with pertinent information that 
 *  does not affect the `target` object that receives the parsed arguments.
 *
 *  @function run
 *  @param {Object} src the source program or definition.
 *  @param {Array} argv the program arguments.
 *  @param {Object} [runtime] runtime configuration.
 *  @param {Function} cb callback function.
 *
 *  @returns a new program.
 */
function run(src, argv, runtime, cb) {
  var Program = require('./lib/program')
    , runner = require('./lib/run');

  if(!(src instanceof Program)) {
    src = load(src); 
  }

  runner.call(src, argv, runtime, cb);
}

var cli = {};
cli.run = run;
cli.load = load;
cli.camelcase = function() {
  // lazy require
  var camel = require('cli-argparse').camelcase;
  return camel.apply(this, arguments);
}

module.exports = cli;
