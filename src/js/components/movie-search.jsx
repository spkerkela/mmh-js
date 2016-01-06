const React = require('react')

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
