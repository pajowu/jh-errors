"use strict";
paper.install(window);
var COLORS = ["#e52420", "#e6414a", "#ea680c", "#f3971b", "#ffd003", "#ffe50c", "#4cad37", "#00b48d", "#00498c", "#00a6de", "#4c2582", "#51509d", "#e95197"];
var global_font = null;
window.onload = function() {
	paper.setup('paperCanvas');
	renderBadge();
	window.setInterval(function(){
	  renderBadge();
	}, 1000);
}
function randomSkew(v) {
	return parseInt(v) + (Math.random()-0.5)/5;
}
function skewedPoint(x,y) {
	return new Point(randomSkew(x),y)
}
function skewedPath(path_str, color) {
	var points = [];
	var x_cache = {};
	var y_cache = {};
	path_str.split(" ").forEach(function (s) {

		var x = s.split(",")[0];
		var y = s.split(",")[1];
		if (!(x in x_cache)) {
			x_cache[x] = randomSkew(x);
		}
		if (!(y in y_cache)) {
			y_cache[y] = randomSkew(y);
		}
		var x_new = x_cache[x];
		var y_new = y_cache[y];
		points.push(new Point(x_new,y_new))
	});
	var path = new Path(points);
	path.fillColor = color;
}
function mouth() {
	skewedPath("4,7 4,9 7,9 7,7 6,7 6,8 5,8 5,7", "black");
}
function eyes() {
	var path = new Path.Rectangle(skewedPoint(2,6), skewedPoint(3,7));
	path.fillColor = "black";
	var path = new Path.Rectangle(skewedPoint(8,6), skewedPoint(9,7));
	path.fillColor = "black";
}
function ears(color) {
	skewedPath("1,0 3,0 3,1 4,1 4,2 7,2 7,1 8,1 8,0 10,0 10,1 11,1 11,5 10,5 10,8 9,8 9,9 8,9 8,10 3,10 3,9 2,9 2,8 1,8 1,5 0,5 0,9 1,9 1,10 2,10 2,11 9,11 9,10 10,10 10,9 11,9 11,5 9,5 9,4 2,4 2,5 0,5 0,1 1,1", color);
}
function addText(font, text, center, font_size, text_color) {
	var lineGroup = new Group();
	var x = 0;
	var y = 0;
	const fontScale = 1 / font.unitsPerEm * font_size;

	for(var i = 0; i<text.length; i++){
		var fontpaths = font.getPath(text[i], center.x, center.y, font_size);
		var paperpath = paper.project.importSVG(fontpaths.toSVG());
		paperpath.fillColor = text_color;
		paperpath.bounds.x = x;
		x += font.getAdvanceWidth(text[i], font_size);
		paperpath.bounds.y += randomSkew(0) / 5;
		if (i > 0) {
			var left = font.charToGlyph(text[i-1]);
			var right = font.charToGlyph(text[i]);
			var kern = font.getKerningValue(left, right);
			x += (kern) * fontScale;
			x += randomSkew(0) * 1000 * fontScale;
		}
		lineGroup.addChild(paperpath);
	}
	lineGroup.position.x = center.x;
	lineGroup.position.y = center.y;

	lineGroup.bringToFront();
	return lineGroup;
}
function loadFont(text, center, font_size, text_color) {
	opentype.load("ebisu.ttf", function(err, font) {
		global_font = font;
		addText(font, text, center, font_size, text_color);
	});
}
function renderBadge() {
	project.clear();
	paper.view.zoom = 50;
	paper.view.center = (5.5,5.5);
	var color = COLORS[Math.floor(Math.random() * COLORS.length)];
	mouth();
	eyes();
	ears(color);
	if (!global_font) {
		global_font = "loading";
		loadFont("Wartungsarbeiten", new Point(5.5,10.5), 0.7, "white");
	} else {
		if (global_font != "loading") {
			addText(global_font, "Wartungsarbeiten", new Point(5.5,10.5), 0.7, "white");
		}
	}

}
