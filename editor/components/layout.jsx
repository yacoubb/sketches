import css from '../components/main.scss'
import Link from 'next/link'
import Header from './header'
import Head from 'next/head'
import Footer from './footer'

export default function Layout(props) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
                    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
                    crossorigin="anonymous"
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
    )
}
