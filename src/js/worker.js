/* global fetch */
const B = require('baconjs')
const PouchDB = require('pouchdb')

const localDB = new PouchDB('movies')
const remoteCouch = 'http://localhost:5984/movies'

function insertMovie(movie) {
    localDB.put(movie, (err, result) => {
        if(!err) {
            postMessage({ movie: movie })
        }
    })
}

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
    .filter(resp => resp.Response !== 'False')
    .map(movie => {
       movie._id = movie.imdbID 
       return movie 
    }).log()
    
const dbUpdates = B.fromEvent(localDB.changes({
    since: 'now',
    live: true
}), 'change').log('db updates')

movieSearch.onValue(movie => insertMovie(movie))