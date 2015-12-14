const B = require('baconjs')
const MyWorker = require('worker!./worker')
const myWorker = MyWorker()

const workerStream = B.fromBinder(sink => {
	myWorker.onmessage = (e) => {
		sink(e)
	}

	myWorker.onerror = (e) => {
		sink(new B.Error(e))
	}
}).log()

const dispatch = (message) => {
	myWorker.postMessage(message)
}

const subscribe = (data) => {
	return workerStream.map('.data').filter(data)
}

module.exports = {
	subscribe,
	dispatch
}