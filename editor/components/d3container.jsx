import React, { useState, useEffect, useLayoutEffect } from 'react';

const D3Container = ({ id, args }) => {
	const [d3Sketch, setD3Sketch] = useState(undefined);
	const [svgWidth, setSvgWidth] = useState(200);

	const computeWidth = () => setSvgWidth(document.getElementById(id).offsetWidth);
	useEffect(() => {
		setD3Sketch(() => require(`../sketchfiles/${id}`).default);
		window?.addEventListener('resize', computeWidth);
		return () => window?.removeEventListener('resize', computeWidth);
	}, []);
	useLayoutEffect(() => {
		computeWidth();
		if (d3Sketch) {
			return d3Sketch({ id, ...args });
		}
	});

	return <div id={id} style={{ width: '100%', height: '100%' }}></div>;
};

export default D3Container;
