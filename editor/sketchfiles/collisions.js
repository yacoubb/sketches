import * as d3 from 'd3'

var nodes = []
var simulation

function d3test(props) {
    // console.log(props)
    const count = parseInt(props.count.value) + 1
    console.log(`collisions with count ${count}`)

    const container = d3.select(`#${props.id}`)
    const w = container.node().clientWidth
    const h = container.node().clientHeight

    const k = w / 200
    const r = d3.randomUniform(k, k * 4)
    const n = 4

    const color = d3.scaleOrdinal(d3.range(n), ['transparent'].concat(d3.schemeTableau10))

    container.selectAll('canvas').data([0]).enter().append('canvas')
    const canvas = d3.select('canvas')
    canvas.attr('width', w).attr('height', h)
    console.log(canvas.node())
    // debugger;
    const context = canvas.node()?.getContext('2d')

    if (simulation) {
        simulation.stop()
        nodes = simulation.nodes()
    }

    nodes = nodes.filter((_, index) => index < count)
    while (nodes.length < count) {
        nodes.push({ r: r(), group: nodes.length && (nodes.length % n) + 1 })
    }

    simulation = d3
        .forceSimulation(nodes)
        .alphaTarget(0.3) // stay hot
        .velocityDecay(0.1) // low friction
        .force('x', d3.forceX().strength(0.01))
        .force('y', d3.forceY().strength(0.01))
        .force(
            'collide',
            d3
                .forceCollide()
                .radius((d) => d.r + 1)
                .iterations(3),
        )
        .force(
            'charge',
            d3.forceManyBody().strength((d, i) => (i ? 0 : -w / 3)),
        )
        .on('tick', ticked)

    d3.select(context.canvas)
        .on('touchmove', (event) => event.preventDefault())
        .on('pointermove', pointed)

    // invalidation.then(() => simulation.stop())

    function pointed(event) {
        const [x, y] = d3.pointer(event)
        nodes[0].fx = x - w / 2
        nodes[0].fy = y - h / 2
    }

    function ticked() {
        context.clearRect(0, 0, w, h)
        context.save()
        context.translate(w / 2, h / 2)
        for (const d of nodes) {
            context.beginPath()
            context.moveTo(d.x + d.r, d.y)
            context.arc(d.x, d.y, d.r, 0, 2 * Math.PI)
            context.fillStyle = color(d.group)
            context.fill()
        }
        context.restore()
    }

    return () => {
        console.log('clearing')
        if (simulation) {
            simulation.stop()
            nodes = simulation.nodes()
        }
    }
}

export default d3test
