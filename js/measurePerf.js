export default function measure() {
	performance.mark('end')
	performance.measure('first line', 'start', 'end')
	console.log(performance.getEntriesByType('measure')[0].duration)
	performance.clearMarks()
	performance.clearMeasures()
}