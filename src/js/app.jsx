const React = require('react')
const ReactDOM = require('react-dom')
const B = require('baconjs')
const {subscribe, dispatch} = require('./worker-stream')

const MovieInfo = React.createClass({
    render() {
        const {movie} = this.props
        const img = movie.Poster !== 'N/A' ? <img src={movie.Poster} /> : null
        return (
            <div>
                <p>{movie.Plot}</p>
                <div>{movie.Actors}</div>
                <div>{movie.Runtime}</div>
                <div>{movie.Writer}</div>
                <div>{movie.Year}</div>
                <div>{movie.Rated}</div>
                <div>{movie.Awards}</div>
                {img}
            </div>
        )
    }
})

const MyComponent = React.createClass({
	componentDidMount() {
		const {countStream} = this.props
		
		const stateUpdate = B.combineTemplate({
			count: countStream.map('.count')
		})
		
		stateUpdate.onValue(newState => {
			this.setState(newState)
		})
	},
	getInitialState() {
		return {count: 1}
	},
	render() {
		const {count} = this.state
		return <h2>Mjaijai {count}</h2>
	}
})

const MyHeader = React.createClass({
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
            Title: 'No movie searched yet'
        }}
	},
	render() {
		const {movie} = this.state
        const {Title} = movie
		return (
            <div>
                <h2>{Title}</h2>
                <MovieInfo movie={movie} />
            </div>
        )
	}
})

const MyInput = React.createClass({
	myChange(e) {
		const {value} = e.target
		dispatch({action: 'headerSet', value})	
	},
	render() {
		return <input type={'text'} onChange={this.myChange}></input>
	}
})

ReactDOM.render(
	<div>
		<h1>Hello World</h1>
		<MyHeader headerStream={subscribe('.movie')}/>
		<MyInput />
		<MyComponent countStream={subscribe('.count')}/>
	</div>,
	document.getElementById('app')
)