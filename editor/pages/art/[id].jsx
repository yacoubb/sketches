import React, { useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import Head from 'next/head'
import css from '../../components/main.scss'

import index from '../../../sketch-index.json'
import Link from 'next/link'

import D3Container from '../../components/d3container'
import P5Container from '../../components/p5container'

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
                if (!('value' in action)) {
                    throw new Error('action has no value property')
                }
                return {
                    ...state,
                    [action.id]: { ...(state[action.id] ?? { id: action.id }), value: action.value },
                }
            case 'meta':
                if (!('meta' in action)) {
                    throw new Error('action has no meta property')
                }
                return {
                    ...state,
                    [action.id]: { ...(state[action.id] ?? { id: action.id }), ...action.meta },
                }
            case 'clear':
                return {}
            default:
                throw new Error(`action of type ${action.type} is invalid`)
        }
    }

    const [guiState, guiDispatch] = useReducer(guiReducer, {})
    useEffect(() => {
        // initialise guiState
        guiDispatch({ type: 'clear' })
        Object.keys(guiItems).forEach((id) => {
            guiDispatch({ type: 'setValue', id, value: guiItems[id].defaultValue })

            guiDispatch({
                type: 'meta',
                id,
                meta: {
                    updateVal: (value) => {
                        guiDispatch({ type: 'setValue', id, value })
                        if (guiItems[id].update) {
                            guiDispatch({ type: 'update' })
                        }
                    },
                    updateMeta: (meta) => {
                        guiDispatch({ type: 'meta', id, meta })
                    },
                },
            })
        })
        guiDispatch({ type: 'update' })
    }, [id])

    const [args, setArgs] = useState({})
    useEffect(() => {
        setArgs(guiState)
    }, [guiState.runTime, id])

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
                                    onChange={(e) => guiState[id].updateVal(e.target.value)}
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
                                onChange={(e) => guiState[id].updateVal(e.target.value)}
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
                        return <div key={idx}>{format}</div>
                }
            })}
        </div>
    )

    // we should only render the sketch when all of the gui elements have been initialised in the state variable
    const stateKeys = new Set(Object.keys(guiState))
    const listKeys = new Set(Object.keys(guiItems))
    const diff = (a, b) => new Set([...a].filter((x) => !b.has(x)))

    const symDiff = new Set([...diff(stateKeys, listKeys)], [...diff(listKeys, stateKeys)])

    const sketch = symDiff.size === 1 && symDiff.has('runTime') && (
        <div className="col-lg" style={{ height: '70vmin' }}>
            {sketchInfo['type'] === 'd3' && <D3Container id={sketchInfo['id']} args={args} />}
            {sketchInfo['type'] === 'p5' && <P5Container id={sketchInfo['id']} args={args} />}
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
                            {sketch}
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
