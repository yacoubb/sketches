import React, { useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import Head from 'next/head'
import css from '../../components/main.scss'

import index from '../../../sketch-index.json'
import Link from 'next/link'

import D3Container from '../../components/d3container'
import P5Container from '../../components/p5container'

var guiUpdateFunction

const ArtLayout = () => {
    const router = useRouter()
    const { id } = router.query

    const sketchInfo = index[id] ?? {
        id: undefined,
        title: 'Page not found',
        description: [`A sketch with the name ${id} doesn't exist!`],
    }

    const guiItems = sketchInfo['gui'] ?? {}

    const guiReducer = (state, action) => {
        switch (action.type) {
            case 'update':
                return { ...state, runTime: new Date().valueOf() }
            case 'setValue':
                return {
                    ...state,
                    [action.id]: { value: action.value, update: (val) => guiUpdateFunction(action.id, val) },
                }
            default:
                throw new Error(`action of type ${action.type} is invalid`)
        }
    }

    const [guiState, guiDispatch] = useReducer(guiReducer, {})

    useEffect(() => {
        Object.values(guiItems).forEach((guiItem) => {
            guiDispatch({ type: 'setValue', id: guiItem.id, value: guiItem.defaultValue })
        })
        guiDispatch({ type: 'update' })
    }, [id])

    const [args, setArgs] = useState({})
    useEffect(() => {
        setArgs(guiState)
    }, [guiState.runTime])

    guiUpdateFunction = (id, val) => {
        guiDispatch({ type: 'setValue', id: id, value: val })
        if (guiItems[id].update) {
            guiDispatch({ type: 'update' })
        }
    }

    const gui = (
        <div className="col-lg-2">
            {Object.values(guiItems).map((guiElem, idx) => {
                const { id, type } = guiElem
                if (guiState[id] === undefined) {
                    return null
                }

                switch (type) {
                    case 'slider':
                        var label = guiElem['label']
                        label = label.replace('$VALUE', `${guiState[id].value}`)
                        return (
                            <React.Fragment key={idx}>
                                {label}
                                <input
                                    type="range"
                                    className="custom-range"
                                    min={guiElem['min']}
                                    max={guiElem['max']}
                                    value={guiState[id].value}
                                    step={guiElem['step']}
                                    id={id}
                                    // onChange={(e) => guiUpdateFunction(id, e.target.value)}
                                    onChange={(e) => guiState[id].update(e.target.value)}
                                />
                            </React.Fragment>
                        )
                    case 'text':
                        return (
                            <input
                                key={idx}
                                type="text"
                                className="form-control"
                                id={id}
                                // aria-describedby="emailHelp"
                                placeholder={guiElem['placeholder']}
                                value={guiState[id].value}
                                onChange={(e) => guiState[id].update(e.target.value)}
                                style={{ margin: '1em 0 1em 0' }}
                            />
                        )
                    case 'button':
                        return (
                            // TODO one day add other functionality
                            <button key={idx} className={guiElem['className']} onClick={() => guiDispatch({ type: 'update' })}>
                                {guiElem['label']}
                            </button>
                        )
                    case 'label':
                        var format = guiElem['format'].replace('$VALUE', `${guiState[id].value}`)
                        return <span>{format}</span>
                }
            })}
        </div>
    )

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Art</title>
            </Head>
            <Layout>
                <div className="container" style={{ paddingTop: '2em' }}>
                    <h1>{sketchInfo['title']}</h1>
                    <div>
                        {sketchInfo['description'].map((val, idx) => (
                            <p key={idx}>{val}</p>
                        ))}
                    </div>
                    {sketchInfo['id'] !== undefined ? (
                        <div className="row">
                            <div className="col-lg" style={{ height: '70vmin' }}>
                                {sketchInfo['type'] === 'd3' && <D3Container id={sketchInfo['id']} args={args} />}
                                {sketchInfo['type'] === 'p5' && <P5Container id={sketchInfo['id']} args={args} />}
                            </div>
                            {Object.keys(guiItems).length > 0 && gui}
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
    )
}

export default ArtLayout
