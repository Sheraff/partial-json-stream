export default function measure() {
	performance.mark('end')
	performance.measure('first line', 'start', 'end')
	const duration = performance.getEntriesByType('measure')[0].duration
	performance.clearMarks()
	performance.clearMeasures()
	return duration
}