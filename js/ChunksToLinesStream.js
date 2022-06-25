class ChunksToLinesTransformer {
	#previous = ''

	transform(chunk, controller) {
		let startSearch = this.#previous.length
		this.#previous += chunk
		while (true) {
			// Works for EOL === '\n' and EOL === '\r\n'
			const eolIndex = this.#previous.indexOf('\n', startSearch)
			if (eolIndex < 0)
				break

			// line includes the EOL
			const line = this.#previous.slice(0, eolIndex + 1)
			controller.enqueue(line)
			this.#previous = this.#previous.slice(eolIndex + 1)
			startSearch = 0
		}
	}

	flush(controller) {
		// Clean up and enqueue any text we're still holding on to
		if (this.#previous.length > 0) {
			controller.enqueue(this.#previous)
		}
	}
}

export default class ChunksToLinesStream extends TransformStream {
	constructor() {
		super(new ChunksToLinesTransformer())
	}
}