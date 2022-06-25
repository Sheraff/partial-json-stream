import ChunksToLinesStream from "./ChunksToLinesStream.js"
import LineToObjectStream from "./LineToObjectStream.js"
import measure from "./measurePerf.js"
import ActionnableSink from "./ActionnableStream.js"

document.getElementById('stream').addEventListener('click', (event) => {
	event.preventDefault()
	clearDomResults()
	const selectionMethod = getSelectionMethod()
	fetchWithStream(selectionMethod)
})
document.getElementById('json').addEventListener('click', (event) => {
	event.preventDefault()
	clearDomResults()
	const selectionMethod = getSelectionMethod()
	fetchWithJson(selectionMethod)
})

async function fetchWithStream(method) {
	const actionnableSink = method === 'every'
		? new ActionnableSink(getEvery100SinkAction())
		: new ActionnableSink(getFirst100SinkAction())

	const response = await fetch('/data/names.json')

	performance.mark('start')
	await response.body
		.pipeThrough(new TextDecoderStream('utf-8'))
		.pipeThrough(new ChunksToLinesStream())
		.pipeThrough(new LineToObjectStream())
		.pipeTo(actionnableSink)
	console.log(actionnableSink.get())
}

async function fetchWithJson(method) {
	const response = await fetch('/data/names.json')

	performance.mark('start')
	const json = await response.json()

	const displayable = method === 'every'
		? json.reduce((array, obj, i) => (i%100 === 0) ? array.concat(obj) : array, [])
		: json.slice(0, 100)

	displayable.forEach(object => writeObjectToDom(object))
	console.log(json)
}


function getFirst100SinkAction() {
	let count = 0
	const max = 100
	return (object) => {
		if(count < max) {
			writeObjectToDom(object)
		}
		count++
	}
}

function getEvery100SinkAction() {
	let count = 0
	return (object) => {
		if(count%100 === 0) {
			writeObjectToDom(object)
		}
		count++
	}
}

let isFirstResult = true

function writeObjectToDom(object) {
	requestAnimationFrame(() => {
		const node = document.getElementById('results')
		const element = document.createElement('div')
		element.textContent = object.name
		node.appendChild(element)

		if(isFirstResult) {
			measure()
			isFirstResult = false
		}
	})
}

function clearDomResults() {
	const node = document.getElementById('results')
	node.innerHTML = ''
	isFirstResult = true
}

function getSelectionMethod() {
	return new FormData(document.forms[0]).get('selection')
}