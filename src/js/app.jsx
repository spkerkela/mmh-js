const React = require('react')
const ReactDOM = require('react-dom')
const B = require('baconjs')
const {subscribe, dispatch} = require('./worker-stream')
const R = require('ramda')

const BodyCountInput = React.createClass({
    getInitialState() {
        const bodyCount = this.props.movie.bodyCount || 0
        
        return {
            bodyCount: 0
        }
    },
    updateBodyCount(e) {
        const bodyCount = e.target.value
        
        this.setState({bodyCount: parseInt(bodyCount) || 0})
    },
    saveMovie() {
        const {movie} = this.props
        const {bodyCount} = this.state
        console.log('saving movie')
        movie.bodyCount = bodyCount
        dispatch({action: 'saveMovie', value: movie})
    },
    render() {
        const {bodyCount} = this.state
        return (
            <div>
                <input type={'number'} step={1} min={0} value={bodyCount} onChange={this.updateBodyCount}/>
                <input type={'button'} value={'Save'} onClick={this.saveMovie}/>
            </div>
        )
    }
})

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
            return <li className={'clickable'} onClick={() => this.movieClicked(movie)} key={i}>{movie.title||movie.Title}</li>
        })
        
        return (
            <div className={'pane right'}>
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
            <div  className={'pane'}>
                <h2>{movie.title}</h2>
                <p>{movie.plot}</p>
                <MovieAttribute attr={movie.actors} />
                <MovieAttribute attr={movie.runtime} />
                <MovieAttribute attr={movie.writer} />
                <MovieAttribute attr={movie.year} />
                <MovieAttribute attr={movie.rated} />
                <MovieAttribute attr={movie.awards} />
                <BodyCountInput movie={movie}/>
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
		return {}
	},
	render() {
		const {movie} = this.state
        const elem = movie ? <MovieInfo movie={movie} /> : null 
		return (
            <div>
                {elem}
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
        <MovieListing moviesStream={subscribe('.movies')}/>
		<MovieContent headerStream={subscribe('.movie')}/>
	</div>,
	document.getElementById('app')
)