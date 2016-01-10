const React = require('react')

const DateInput = React.createClass({
    render() {
        return <input type={'date'} />
    }
})

export const MarathonContent = React.createClass({
    render() {
        return (
            <div>
            <h3>Enter a date for the marathon</h3>
            <DateInput />
            </div>
        )
    }
})
