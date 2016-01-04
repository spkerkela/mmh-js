/* global fetch */
const B = require('baconjs')

const countStream = B.repeatedly(1000, [1, 2, 3, 4, 5])
let i = 0
countStream.onValue((v) => {
    i++
    postMessage({ count: i })
})

const messageStream = B.fromBinder(sink => {
    onmessage = (e) => {
        sink(e)
    }
    onerror = (e) => {
        sink(new B.Error(e))
    }
})

messageStream
    .map('.data')
    .filter(e => e.action === 'headerSet')
    .throttle(200)
    .flatMap(data => {
        return B.fromPromise(fetch('https://omdbapi.com/?t=' + data.value,
            { mode: 'cors', method: 'GET' })
            .then(response => {
                return response.json()
            }))
    })
    .onValue(data => {
        console.log(data)
        postMessage({ header: data.value })
    })