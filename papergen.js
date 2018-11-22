#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var path = require('path');
var cli = require('./lib/cli');
var build = require('./lib/build');
var Booklet = require('./lib/booklet');
var spawn = require('child_process').spawn;
function papergen(pages, options) {
    build(pages, options);
    var electron = path.resolve(__dirname, 'node_modules', '.bin', 'electron');
    var main = path.resolve(__dirname, 'lib', 'main.js');
    var child = spawn(electron, [main]);
    child.stdout.on('data', function (data) {
        console.log('Electron: ', data.toString());
    });
    child.stderr.on('data', function (data) {
        console.error('Electron: ', data.toString());
    });
    child.on('close', function (code) {
        console.log("Electron process closed with " + code);
    });
}
papergen.Page = require('./lib/page');
papergen.fromBooklet = function (booklet) {
    if (booklet instanceof Booklet) {
        papergen(booklet.pages, booklet.options);
        return;
    }
    console.error('Not a booklet.');
};
if (require.main === module) {
    var cliResult = cli(process.argv);
    if (cliResult) {
        papergen(cliResult.pages, cliResult.options);
    }
}
module.exports = papergen;
