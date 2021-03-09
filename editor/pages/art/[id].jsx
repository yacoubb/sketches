import React, { Component } from 'react';
import Layout from '../../components/layout';
import Head from 'next/head';
import css from '../../components/main.scss';

import index from '../../../sketch-index.json';
import Link from 'next/link';

import D3Container from '../../components/d3container';
import P5Container from '../../components/p5container';

class ArtLayout extends Component {
	static async getInitialProps(ctx) {
		const id = ctx.query.id;
		var info = index[id];
		if (info == undefined) {
			info = {
				id: undefined,
				title: 'Page not found',
				description: [`A sketch with the name ${ctx.query.id} doesn't exist!`],
			};
		}
		if (info['gui'] == undefined) {
			info['gui'] = [];
		}
		return {
			id,
			info,
		};
	}

	constructor(props) {
		super(props);
		this.state = { args: {} };
		for (var guiElem of props.info['gui']) {
			this.state[guiElem['id']] = guiElem['value'];
			this.state.args[guiElem['id']] = guiElem['value'];
		}
		this.updateArgs = this.updateArgs.bind(this);
	}

	updateArgs() {
		var updatedArgs = { runTime: new Date().valueOf() };
		for (var guiElem of this.props.info['gui']) {
			updatedArgs[guiElem['id']] = this.state[guiElem['id']];
		}

		this.setState({ args: updatedArgs });
	}

	gui() {
		return (
			<div className="col-lg-2">
				{this.props.info['gui'].map((guiElem, idx, arr) => {
					switch (guiElem['type']) {
						case 'slider':
							var label = guiElem['label'];
							label = label.replace('$VALUE', `${this.state[guiElem['id']]}`);
							return (
								<React.Fragment key={idx}>
									{label}
									<input
										type="range"
										className="custom-range"
										min={guiElem['min']}
										max={guiElem['max']}
										value={this.state[guiElem['id']]}
										step={guiElem['step']}
										id={guiElem['id']}
										onChange={(e) => {
											this.setState({ [guiElem['id']]: e.target.value }, () => {
												if (guiElem['update']) {
													this.updateArgs();
												}
											});
										}}
									/>
								</React.Fragment>
							);
							break;
						case 'text':
							return (
								<input
									key={idx}
									type="text"
									className="form-control"
									id={guiElem['id']}
									// aria-describedby="emailHelp"
									placeholder={guiElem['placeholder']}
									value={this.state[guiElem['id']]}
									onChange={(e) => {
										this.setState({ [guiElem['id']]: e.target.value }, () => {
											if (guiElem['update']) {
												this.updateArgs();
											}
										});
									}}
									style={{ margin: '1em 0 1em 0' }}
								/>
							);
							break;
						case 'button':
							return (
								// TODO one day add other functionality
								<button
									key={idx}
									className={guiElem['className']}
									onClick={guiElem['update'] ? this.updateArgs : () => {}}
								>
									{guiElem['label']}
								</button>
							);
							break;
					}
				})}
			</div>
		);
	}

	render() {
		return (
			<>
				<Head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Art</title>
				</Head>
				<Layout>
					<div className="container" style={{ paddingTop: '2em' }}>
						<h1>{this.props.info['title']}</h1>
						<div>
							{this.props.info['description'].map((val, idx) => (
								<p key={idx}>{val}</p>
							))}
						</div>
						{this.props.info['id'] !== undefined ? (
							<div className="row">
								<div className="col-lg" style={{ height: '70vmin' }}>
									{this.props.info['type'] === 'd3' && (
										<D3Container id={this.props.info['id']} args={this.state.args} />
									)}
									{this.props.info['type'] === 'p5' && (
										<P5Container id={this.props.info['id']} args={this.state.args} />
									)}
								</div>
								{this.props.info['gui'].length > 0 && this.gui()}
							</div>
						) : (
							<Link href="/editor">
								<button className="btn btn-primary">Return to d3es</button>
							</Link>
						)}

						<br />
						<p style={{ fontSize: '12px', color: `${css.linkHover}` }}>Interactive pages work best on desktop!</p>
					</div>
				</Layout>
			</>
		);
	}
}

export default ArtLayout;