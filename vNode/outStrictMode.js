module.exports.runCode = function (str, ctx) {
    with (ctx) {
        return eval(str)
    }
}