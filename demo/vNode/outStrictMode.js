module.exports.runCode = function (codeWillRun, ctx) {
    with (ctx._proxy) {
        return eval(codeWillRun)
    }
}