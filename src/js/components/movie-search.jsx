const React = require('react')
const {dispatch} = require('../worker-stream')

export const MovieSearch = React.createClass({
    myChange(e) {
	const {value} = e.target
	dispatch({action: 'searchMovie', value})	
    },
    render() {
	return (
            <div>
                <h3>Search for a movie</h3>
                <input type={'text'} onChange={this.myChange}></input>
            </div>
        )
    }
})
