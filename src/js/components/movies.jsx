const React = require('react')
const {subscribe, dispatch} = require('../worker-stream')
const B = require('baconjs')

export const MovieListing = React.createClass({
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
