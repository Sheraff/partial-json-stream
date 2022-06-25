import measure from "./measurePerf.js"

/** @type {UnderlyingSink} */
class ActionnableSkink {
	data = []

	constructor(action) {
		this.action = action
	}

	write(object) {
		this.action(object)
		this.data.push(object)
	}
}

export default class ActionnableStream extends WritableStream {
	constructor(action) {
		const sink = new ActionnableSkink(action)
		super(
			sink,
			new CountQueuingStrategy({ highWaterMark: 1 })
		)
		this.sink = sink
	}
	get(){
		return this.sink.data
	}
}