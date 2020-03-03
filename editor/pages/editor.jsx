import Layout from '../components/layout';
import Link from 'next/link';
import Head from 'next/head';
import css from '../components/main.scss';

import sketchIndex from '../../sketch-index.json';

export default function Art() {
	const sketches = Object.keys(sketchIndex).map((sketchID, idx) => (
		<div className="col-sm-4" key={idx}>
			<Link href={`/editor/${sketchID}`}>
				<a>
					{/* <img src={`/sketch-thumbs/${sketchID}.png`} style={{ width: '100%', marginBottom: '1em' }} /> */}
					<img
						src={`https://github.com/yacoubb/sketches/blob/master/interactive/${sketchID}/thumb.png?raw=true`}
						style={{ width: '100%', marginBottom: '1em' }}
					/>
				</a>
			</Link>
		</div>
	));

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Art</title>
			</Head>
			<Layout>
				<div
					className="container"
					style={{ paddingTop: '2em', marginBottom: '2em', minHeight: '100vh' }}
				>
					<h1>Interactive Pieces</h1>
					<div className="row" style={{ paddingTop: '2em' }}>
						{sketches}
					</div>
				</div>
			</Layout>
		</>
	);
}
