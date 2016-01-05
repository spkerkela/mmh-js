const React = require('react')
const ReactDOM = require('react-dom')
const B = require('baconjs')
const {subscribe, dispatch} = require('./worker-stream')
const R = require('ramda')

const MovieListing = React.createClass({
    movieClicked(movie) {
        dispatch({action: 'searchDB', value: movie._id})
    },
    componentDidMount() {
		const {moviesStream} = this.props
		const stateUpdate = B.combineTemplate({
			dbMovies: moviesStream
                .map('.movies')
                
		})
		
		stateUpdate.onValue(newState => {
			this.setState(newState)
		})
	},
	getInitialState() {
		return {dbMovies: []}
	},
    render() {
        const {dbMovies} = this.state
        
        const movieElems = dbMovies.map((movie,i) => {
            return <li onClick={() => this.movieClicked(movie)} key={i}>{movie.title||movie.Title}</li>
        })
        
        return (
            <div>
            <h3>Movies in Database</h3>
            <ul>
                {movieElems}
            </ul>
            </div>
        )
    }
})

const MovieAttribute = React.createClass({
    render() {
        const {attr} = this.props
        if(R.isArrayLike(attr)) {
            return <div>{attr.join(', ')}</div>
        } else {
            return <div>{attr}</div>
        }
    }
})

const MovieInfo = React.createClass({
    
    render() {
        const {movie} = this.props
        const img = movie.poster ? <img src={movie.poster} /> : null
        return (
            <div>
                <p>{movie.plot}</p>
                <MovieAttribute attr={movie.actors} />
                <MovieAttribute attr={movie.runtime} />
                <MovieAttribute attr={movie.writer} />
                <MovieAttribute attr={movie.year} />
                <MovieAttribute attr={movie.rated} />
                <MovieAttribute attr={movie.awards} />
                {img}
            </div>
        )
    }
})

const MovieContent = React.createClass({
	componentDidMount() {
		const {headerStream} = this.props
		
		const stateUpdate = B.combineTemplate({
			movie: headerStream.map('.movie')
		})
		
		stateUpdate.onValue(newState => {
			this.setState(newState)
		})
	},
	getInitialState() {
		return {movie: {
            title: 'No movie searched yet'
        }}
	},
	render() {
		const {movie} = this.state
        const {title} = movie
		return (
            <div>
                <h2>{title}</h2>
                <MovieInfo movie={movie} />
            </div>
        )
	}
})

const MyInput = React.createClass({
	myChange(e) {
		const {value} = e.target
		dispatch({action: 'searchMovie', value})	
	},
	render() {
		return <input type={'text'} onChange={this.myChange}></input>
	}
})

ReactDOM.render(
	<div>
        <h3>Search for a movie</h3>
        <MyInput />
		<MovieContent headerStream={subscribe('.movie')}/>
        <MovieListing moviesStream={subscribe('.movies')}/>
	</div>,
	document.getElementById('app')
)