function testWith() {
    with ({a: 1}) {
        return eval('a+1')
    }
}

console.log(testWith())
