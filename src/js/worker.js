const B = require('baconjs')

const countStream = B.repeatedly(1000, [1, 2, 3, 4, 5])

countStream.onValue((v) => {
	postMessage({ count: v })
})

const messageStream = B.fromBinder(sink => {
	onmessage = (e) => {
		sink(e)
	}
	onerror = (e) => {
		sink(new B.Error(e))
	}
})

messageStream
	.map('.data')
	.filter(e => e.action === 'headerSet')
	.onValue(data => {
		console.log(data)
		postMessage({ header: data.value })
	})