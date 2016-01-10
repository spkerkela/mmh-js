const React = require('react')
const {render} = require('react-dom')
const {subscribe} = require('./worker-stream')
const {MovieListing} = require('./components/movies.jsx')
const {MovieSearch} = require('./components/movie-search.jsx')
const {MovieContent} = require('./components/movie-content.jsx')
const {MarathonContent} = require('./components/marathons.jsx')
const {Router, Route, Link, browserHistory} = require('react-router')

const Movies = React.createClass({
    render() {
        
        return (
           <div> 
              <MovieSearch/>
              <MovieListing moviesStream={subscribe('.movies')}/>
              <MovieContent headerStream={subscribe('.movie')}/>
           </div> 
        )
    }
})

const App = React.createClass({
    render() {
        return (
            <div>
            <ul>
            <li><Link to={'/marathons'}>Marathons</Link></li>
            <li><Link to={'/movies'}>Movies</Link></li>
            </ul>
            {this.props.children}
            </div>
        )
    }
})

const NotFound = React.createClass({
    render() {
        return <h1>404 Page not found.</h1>
    }
})

const application = (<Router history={browserHistory}>
    <Route path="/" component={App}>
        <Route path="marathons" component={MarathonContent}/>
        <Route path="movies" component={Movies}/>
        <Route path="*" component={NotFound}/>
    </Route>
</Router>)

render(
    application,
    document.getElementById('app')
)
