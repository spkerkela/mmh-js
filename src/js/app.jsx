const React = require('react')
const ReactDOM = require('react-dom')
const B = require('baconjs')
const {subscribe, dispatch} = require('./worker-stream')

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
			header: headerStream.map('.header')
		})
		
		stateUpdate.onValue(newState => {
			this.setState(newState)
		})
	},
	getInitialState() {
		return {header: ''}
	},
	render() {
		const {header} = this.state
		return <h2>{header}</h2>
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
		<MyHeader headerStream={subscribe('.header')}/>
		<MyInput />
		<MyComponent countStream={subscribe('.count')}/>
	</div>,
	document.getElementById('app')
)