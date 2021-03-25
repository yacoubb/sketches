/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID) => (p) => {
    class Node {
        constructor(r, x, y) {
            this.r = r
            this.x = x
            this.y = y
            this.s = p.randomGaussian(0, 1)
        }
    }

    const nodes = []

    p.setup = () => {
        p.createCanvas(width, height)
        setTimeout(() => {
            p.windowResized()
        }, 10)
    }

    p.windowResized = function () {
        p.resizeCanvas(document.getElementById(parentDivID).offsetWidth, document.getElementById(parentDivID).offsetHeight)
        p.init()
    }

    const sigmoid = (x) => {
        return 1 / (1 + p.exp(-x))
    }

    p.init = () => {
        nodes.length = 0
        for (let i = 0; i < 20; i++) {
            let attempts = 0
            while (attempts < 10000) {
                attempts++
                const nextNode = new Node(p.random(3, 10) * 20, p.random(0, p.width), p.random(0, p.height))
                let colliding = nodes.some(
                    (node) => Math.sqrt((node.x - nextNode.x) ** 2 + (node.y - nextNode.y) ** 2) < node.r + nextNode.r,
                )
                if (!colliding) {
                    nodes.push(nextNode)
                    console.log(nextNode.s, typeof nextNode.s)
                    break
                }
            }
        }
        p.background(51)
        nodes.forEach((node) => {
            p.fill(255)
            p.stroke(0)
            p.circle(node.x, node.y, node.r)
        })

        p.loadPixels()
        const d = p.pixelDensity()
        const sentiments = []
        for (let x = 0; x < p.width; x++) {
            for (let y = 0; y < p.height; y++) {
                // compute sentiment at this point using distances to all nodes
                const sentiment = nodes.reduce(
                    (acc, curr) => acc + curr.s / Math.max(((x - curr.x) ** 2 + (y - curr.y) ** 2) ** 0.5 - curr.r, 1),
                    0,
                )

                sentiments.push(sentiment)

                const i = (x + y * p.width) * 4
                p.pixels[i] = 255 * (1 - sentiment)
                p.pixels[i + 1] = 255 * sentiment
                p.pixels[i + 2] = 0
                p.pixels[i + 3] = 255
            }
        }
        p.updatePixels()
    }

    p.keyPressed = () => {
        if (p.keyCode === 32) {
            p.init()
        }
    }
}
