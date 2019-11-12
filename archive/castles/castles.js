/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default function sketch(p) {
	var nodes, edges, mapWidth, mapHeight, users;

	p.setup = function() {
		p.createCanvas(
			document.getElementById('gameContainer').offsetWidth,
			document.getElementById('gameContainer').offsetHeight
		);
		p.frameRate(30);
		nodes = edges = mapWidth = mapHeight = undefined;
	};

	p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
		if (props.users) {
			({ nodes, edges, mapWidth, mapHeight, users } = props);
			updateStartingCastles();
		}
		p.resizeCanvas(
			document.getElementById('gameContainer').offsetWidth,
			document.getElementById('gameContainer').offsetHeight
		);
	};

	function updateStartingCastles() {
		if (nodes === undefined) {
			return;
		}
		for (let i = 0; i < nodes.length; i++) {
			nodes[i].team = -1;
			nodes[i].health = 30;
		}
		if (users.length >= 1) {
			nodes[0].team = 0;
			nodes[0].health = 60;
		}
		if (users.length >= 2) {
			let team2index = searchMap({ x: mapWidth, y: mapHeight });
			nodes[team2index].team = 1;
			nodes[team2index].health = 60;
		}
		if (users.length >= 3) {
			let team2index = searchMap({ x: mapWidth, y: 0 });
			nodes[team2index].team = 2;
			nodes[team2index].health = 60;
		}
		if (users.length >= 4) {
			let team2index = searchMap({ x: 0, y: mapHeight });
			nodes[team2index].team = 3;
			nodes[team2index].health = 60;
		}
	}

	function searchMap(searchNode) {
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].x === searchNode.x && nodes[i].y === searchNode.y) {
				return i;
			}
		}
		return false;
	}

	p.draw = function() {
		p.background(200);
		let w = 20;
		p.fill(255);
		if (nodes === undefined || edges === undefined) {
			return;
		}
		p.translate(p.width * 0.05, p.height * 0.05);
		p.stroke(0);
		p.strokeWeight(14);
		for (let i = 0; i < edges.length; i++) {
			p.line(
				(nodes[edges[i].a].x / mapWidth) * p.width * 0.9,
				(nodes[edges[i].a].y / mapHeight) * p.height * 0.9,
				(nodes[edges[i].b].x / mapWidth) * p.width * 0.9,
				(nodes[edges[i].b].y / mapHeight) * p.height * 0.9
			);
		}
		p.strokeWeight(1);
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].dontShow) {
				continue;
			}
			switch (nodes[i].team) {
				case 0:
					p.fill(255, 0, 0);
					break;
				case 1:
					p.fill(0, 0, 255);
					break;
				case 2:
					p.fill(0, 255, 0);
					break;
				case 3:
					p.fill(255, 255, 0);
					break;
				default:
					p.fill(255);
					break;
			}
			p.ellipse(
				(nodes[i].x / mapWidth) * p.width * 0.9,
				(nodes[i].y / mapHeight) * p.height * 0.9,
				(w * nodes[i].health) / 50,
				(w * nodes[i].health) / 50
			);
		}
	};
}
