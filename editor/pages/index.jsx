import React, { Component } from 'react';
import Link from 'next/link';
import p5Index from '../../sketch-index.json';

const Index = () => {
	return (
		<div>
			<h1>Index</h1>
			<ul>
				{Object.keys(p5Index).map((id) => (
					<li key={id}>
						<Link href={`/p5/[id]`} as={`/p5/${id}`}>
							<a>{id}</a>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Index;
