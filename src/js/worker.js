/* global fetch */
const B = require('baconjs')
const PouchDB = require('pouchdb')
const R = require('ramda')

const localDB = new PouchDB('movies')
const remoteCouch = 'http://localhost:5984/movies'

function insertMovie(movie) {
    localDB.put(movie, (err, result) => {
        if (!err) {
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
}).map('.data')

function arrayFromString(text) {
    return text.split(',').map(t => t.trim())
}

function documentFromMovie(movie) {
    movie._id = movie.imdbID
    const pairs = R.toPairs(movie)
    const movieDocument = R.reduce((movieAcc, [key, value]) => {
        if (value === 'N/A') {
            return movieAcc
        }
        const val = R.contains(key, ['Country', 'Director', 'Actors', 'Genre', 'Language', 'Writer']) ? arrayFromString(value) : value
        return R.assoc(key.toLowerCase(), val, movieAcc)
    }, {}, pairs)
    return R.dissoc('response', movieDocument)
}

const movieSearch = messageStream
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
    .map(documentFromMovie).log()

const dbSearch = messageStream
    .filter(e => e.action === 'searchDB')
    .map('.value')
    .flatMap(id => {
        return B.fromNodeCallback(localDB.get.bind(localDB), id)
    })
    .onValue(movie => {
        postMessage({movie:movie})
    })

const dbUpdates = B.fromEvent(localDB.changes({
    since: 'now',
    live: true
}), 'change')

movieSearch.onValue(movie => insertMovie(movie))
dbUpdates
    .flatMap(changes => {
        return B.fromNodeCallback(localDB.allDocs.bind(localDB), {
            include_docs: true,
            descending: true
        })
    })
    .map('.rows')
    .map(moviesList => moviesList.map(m => m.doc))
    .onValue(movies => {
        postMessage({ movies: movies })
    })

B.fromNodeCallback(localDB.allDocs.bind(localDB), {
    include_docs: true,
    descending: true
}).map('.rows')
    .map(moviesList => moviesList.map(m => m.doc))
    .onValue(movies => {
        postMessage({ movies: movies })
    })

function sync() {
    const opts = { live: true }
    localDB.replicate.to(remoteCouch, opts)
    localDB.replicate.from(remoteCouch, opts)
}

sync()