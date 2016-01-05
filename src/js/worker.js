/* global fetch */
const B = require('baconjs')
const db = require('pouchdb')

const messageStream = B.fromBinder(sink => {
    onmessage = (e) => {
        sink(e)
    }
    onerror = (e) => {
        sink(new B.Error(e))
    }
})

const movieSearch = messageStream
    .map('.data')
    .filter(e => e.action === 'searchMovie')
    .throttle(200)
    .flatMap(data => {
        return B.fromPromise(fetch('https://omdbapi.com/?t=' + data.value,
            { mode: 'cors', method: 'GET' })
            .then(response => {
                return response.json()
            }))
    })

movieSearch.onValue(movieData => postMessage({ movie: movieData }))