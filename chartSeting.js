function chartDraw(value){
	// Create liteChart.js Object
	settings = {};
	let d = new liteChart("chart0", settings);

	// Set labels
	d.setLabels(value.labels);

	// Set legends and values
	d.addLegend({"name": "speed", "stroke": "#CDDC39", "fill": "#fff", "values": value.legend});

	// Inject chart into DOM object
	let div = document.getElementById("chart");
	d.inject(div);

	// Draw
	d.draw();
}
// document.addEventListener("DOMContentLoaded",ch)