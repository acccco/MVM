module.exports.runCode = function (codeWillRun, ctx, $index) {
  with (ctx._proxy) {
    return eval(codeWillRun)
  }
}