import css from '../components/main.scss';
import Link from 'next/link';
import Header from './header';
import Head from 'next/head';
import Footer from './footer';

export default function Layout(props) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					rel="stylesheet"
					href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
					integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
					crossOrigin="anonymous"
				/>
			</Head>
			<div style={{ minHeight: '90vh' }}>
				<div className="container">
					<Header />
				</div>
				{props.children}
			</div>
			<Footer />
		</>
	);
}
