import measure from "./measurePerf.js"

class LineToObjectTransformer {
	static regexp = /^\s*(\{.*\}),?\s*$/
	first = false

	transform(line, controller) {
		const match = line.match(LineToObjectTransformer.regexp)
		if(match?.[1]) {
			const object = JSON.parse(match[1])
			controller.enqueue(object)
			// if(!this.first) {
			// 	this.first = true
			// 	measure()
			// }
		}
	}
}

export default class LineToObjectStream extends TransformStream {
	constructor() {
		super(new LineToObjectTransformer())
	}
}