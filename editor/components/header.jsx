import css from '../components/main.scss'
import Link from 'next/link'
import Head from 'next/head'
import React, { Component } from 'react'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navExpanded: false,
        }
    }

    clickedDropdown = () => {
        this.setState({ navExpanded: !this.state.navExpanded })
        console.log('clicked')
    }

    render() {
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
                <nav className="navbar navbar-expand-lg navbar-light" style={{ textAlign: 'left' }}>
                    <a className="navbar-brand" href="/">
                        Yacoub Ahmed
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={this.clickedDropdown}
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className={`collapse navbar-collapse ${this.state.navExpanded ? 'show' : ''}`} id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/blog">
                                    Blog
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/projects">
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a className="nav-link" href="/art">
                                    Art
                                </a>
                            </li>
                            <li>
                                <a className="nav-link" href="/tech">
                                    Tech
                                </a>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li>
                                <a href="mailto:yacoub.ahmedy@gmail.com">
                                    <button className={`btn ${css.redButton} my-2`} style={{ marginRight: '1em' }}>
                                        Contact
                                    </button>
                                </a>
                            </li>
                            <li>
                                <a href="/login">
                                    <button className={`btn ${css.redButton} my-2`}>Login</button>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </>
        )
    }
}

export default Header
