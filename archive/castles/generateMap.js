const yacoubbLib = require('../../../yacoubb-lib.js');
const Delaunator = require('delaunator');
function generateMap(opts, playerCount) {
	//nodes = [createVector(0, 0), createVector(mapWidth, 0)];
	let prngSeed = opts.seed;
	let mapWidth = parseInt(opts.mapWidth);
	let mapHeight = parseInt(opts.mapHeight);
	let nodeCount = opts.nodeCount;
	let nodes = [];
	let edges = [];
	nodes = [{ x: 0, y: 0, team: -1, health: 30 }, { x: mapWidth, y: 0, team: -1, health: 30 }];
	let border = 1;
	nodes = yacoubbLib.uniformPoints(mapWidth - border, floor(mapHeight / 2), floor(nodeCount / 2), {
		points: nodes,
		clamp: 1,
		iteration: 100,
		seed: prngSeed,
		offset: { x: border, y: 0 },
	});
	let triangulation = Delaunator.from(
		nodes,
		point => {
			return point.x;
		},
		point => {
			return point.y;
		}
	);
	edges = [];

	for (let i = 0; i < nodes.length; i++) {
		nodes[i].team = -1;
		nodes[i].health = 30;
	}

	//convert triangulation to list of edges
	for (let i = 0; i < triangulation.trianglesLen; i += 3) {
		for (j = 0; j < 3; j++) {
			let firstIndex = triangulation.triangles[i + j];
			let secondIndex = triangulation.triangles[i + ((j + 1) % 3)];
			let newEdge = { a: firstIndex, b: secondIndex };
			edges.push(newEdge);
		}
	}

	//remove duplicate edges
	for (let i = 0; i < edges.length; i++) {
		for (let j = 0; j < edges.length; j++) {
			if (i == j) {
				continue;
			}
			if (
				(edges[i].a == edges[j].b && edges[i].b == edges[j].a) ||
				(edges[i].a == edges[j].a && edges[i].b == edges[j].b)
			) {
				edges.splice(j, 1);
				i--;
				break;
			}
		}
	}
	//order edges so that they point in ascending direction
	for (let i = 0; i < edges.length; i++) {
		if (edges[i].a > edges[i].b) {
			let temp = edges[i].a;
			edges[i].a = edges[i].b;
			edges[i].b = temp;
		}
	}
	//sort edges so that they increase by (a)
	edges.sort((x, y) => {
		return x.a == y.a ? x.b - y.b : x.a - y.a;
	});

	// console.log('initial sorted map before mirror');
	// console.log(edges.slice());
	// console.log(nodes.slice());
	let halfOffset = nodes.length;

	//mirror nodes and edges
	let mirroredNodes = [];
	let mirroredEdges = [];
	for (let i = 0; i < nodes.length; i++) {
		let newNode = JSON.parse(JSON.stringify(nodes[i]));
		newNode.y = mapHeight - newNode.y;
		mirroredNodes.push(newNode);
	}
	nodes = nodes.concat(mirroredNodes);

	for (let i = 0; i < edges.length; i++) {
		let newEdge = { a: edges[i].a + halfOffset, b: edges[i].b + halfOffset };
		mirroredEdges.push(newEdge);
	}
	edges = edges.concat(mirroredEdges);

	// console.log('mirroring complete');
	// console.log(edges.slice());
	// console.log(nodes.slice());

	//now the map is horizontaly symmetrical, we need to combine the edges in the middle
	let middleNodes = [];
	let furthestY = 0;
	for (let i = 0; i < halfOffset; i++) {
		// only going up to length/2 since we only want the top half of nodes to be considered
		if (nodes[i].y > furthestY) {
			furthestY = nodes[i].y;
			middleNodes = [i];
		} else if (nodes[i].y == furthestY) {
			middleNodes.push(i);
		}
	}
	// console.log("middle nodes: ", middleNodes);

	for (let i = 0; i < middleNodes.length; i++) {
		//TODO eventually add if statement and connect or move
		if (yacoubbLib.deterministicRandom() > 0.5) {
			for (let j = 0; j < edges.length; j++) {
				if (edges[j].a == middleNodes[i] + halfOffset) {
					edges[j].a = middleNodes[i];
				}
				if (edges[j].b == middleNodes[i] + halfOffset) {
					edges[j].b = middleNodes[i];
				}
			}
			nodes[middleNodes[i]].y = floor(mapHeight / 2);
			nodes[middleNodes[i] + halfOffset].dontShow = true;
		} else {
			let connectingEdge = { a: middleNodes[i], b: middleNodes[i] + halfOffset };
			edges.push(connectingEdge);
		}
	}
	//order edges so that they point in ascending direction
	for (let i = 0; i < edges.length; i++) {
		if (edges[i].a > edges[i].b) {
			let temp = edges[i].a;
			edges[i].a = edges[i].b;
			edges[i].b = temp;
		}
	}
	//sort edges so that they increase by (a)
	edges.sort((x, y) => {
		return x.a == y.a ? x.b - y.b : x.a - y.a;
	});
	// console.log('middle nodes tied up');
	// console.log(edges.slice());
	// console.log(nodes.slice());

	//set starting spots for teams
	if (playerCount >= 1) {
		let setIndex = searchNodes(nodes, 0, 0);
		nodes[setIndex].team = 0;
		nodes[setIndex].health = 60;
	}
	if (playerCount >= 2) {
		let setIndex = searchNodes(nodes, mapWidth, mapHeight);
		nodes[setIndex].team = 1;
		nodes[setIndex].health = 60;
	}
	if (playerCount >= 3) {
		let setIndex = searchNodes(nodes, mapWidth, 0);
		nodes[setIndex].team = 2;
		nodes[setIndex].health = 60;
	}
	if (playerCount >= 4) {
		let setIndex = searchNodes(nodes, 0, mapHeight);
		nodes[setIndex].team = 3;
		nodes[setIndex].health = 60;
	}
	//so basically autism i dont know how to remove the nodes and update the edges so that they dont freak out about the fucking stupid index changes
	//so instead im just gonna change their z component and check for it later

	return { nodes: nodes, edges: edges, mapWidth: mapWidth, mapHeight: mapHeight };
	//remove middle nodes and update edges appropriately
}

function searchNodes(nodes, x, y) {
	let i = 0;
	while (i < nodes.length) {
		if (nodes[i].x == x && nodes[i].y == y) {
			return i;
		}
		i++;
	}
	return undefined;
}

function floor(n) {
	return Math.floor(n);
}

function round(n) {
	return Math.round(n);
}

module.exports = {
	generateMap: function(opts, playerCount) {
		return generateMap(opts, playerCount);
	},
};
