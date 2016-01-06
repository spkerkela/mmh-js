const React = require('react')
const ReactDOM = require('react-dom')
const B = require('baconjs')
const {subscribe, dispatch} = require('./worker-stream')
const R = require('ramda')
const {MovieListing} = require('./components/movies.jsx')
const {MovieSearch} = require('./components/movie-search.jsx')
const {MovieContent} = require('./components/movie-content.jsx')

ReactDOM.render(
    <div>
        <MovieSearch/>
        <MovieListing moviesStream={subscribe('.movies')}/>
	<MovieContent headerStream={subscribe('.movie')}/>
    </div>,
    document.getElementById('app')
)
