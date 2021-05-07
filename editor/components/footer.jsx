import css from '../components/main.scss'
import Link from 'next/link'
import Head from 'next/head'

export default function Footer() {
    return (
        <>
            {/* <Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					rel="stylesheet"
					href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
					integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
					crossOrigin="anonymous"
				/>
			</Head> */}
            <footer style={{ minHeight: '10vh' }} id="sticky-footer" className="py-4 bg-dark">
                <div className={`container text-center ${css.footer}`}>
                    <div className="row">
                        <div className="col-md-2"> </div>
                        <div className="col">
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </div>
                        <div className="col">
                            <Link href="/blog">
                                <a>Blog</a>
                            </Link>
                        </div>
                        <div className="col">
                            <Link href="/projects">
                                <a>Projects</a>
                            </Link>
                        </div>
                        <div className="col">
                            <Link href="/art">
                                <a>Art</a>
                            </Link>
                        </div>
                        <div className="col">
                            <Link href="/tech">
                                <a>Tech</a>
                            </Link>
                        </div>
                        <div className="col-md-2"> </div>
                    </div>
                    <div className="row" style={{ marginTop: '1em' }}>
                        <div className="col">
                            <small>Copyright &copy; Yacoub Ahmed 2020</small>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
