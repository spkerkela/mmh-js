const React = require('react')
const ReactDOM = require('react-dom')
const B = require('baconjs')
const {subscribe, dispatch} = require('./worker-stream')
const R = require('ramda')
const {MovieListing} = require('./components/movies.jsx')

const BodyCountInput = React.createClass({
    componentDidMount() {
      const bodyCountStream = subscribe('.movie')
        .map('.movie')
        .map(movie => (movie.bodyCount || 0))
      
      	const stateUpdate = B.combineTemplate({
			bodyCount: bodyCountStream
		})
		
		stateUpdate.onValue(newState => {
			this.setState(newState)
		})
        
    },
    getInitialState() {
        return {
            bodyCount: 0
        }
    },
    updateBodyCount(e) {        
        this.setState({bodyCount: parseInt(e.target.value)})
    },
    saveMovie() {
        const {movie} = this.props
        const {bodyCount} = this.state
        movie.bodyCount = parseInt(bodyCount) || 0
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
                <MovieAttribute attr={movie.type} />
                <MovieAttribute attr={movie.runtime} />
                <MovieAttribute attr={movie.writer} />
                <MovieAttribute attr={movie.year} />
                <MovieAttribute attr={movie.rated} />
                <MovieAttribute attr={movie.awards} />
                <MovieAttribute attr={movie.bodyCount} />
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
