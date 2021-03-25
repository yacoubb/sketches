/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, args) => (p) => {
    var sketchContainer

    p.setup = () => {
        console.log('setup')
        console.log(args)
        sketchContainer = document.getElementById(parentDivID)
        const canvas = p.createCanvas(width, height)

        p.noLoop()
        setTimeout(() => {
            p.windowResized()
            p.loop()
        }, 10)
    }

    p.windowResized = function () {
        if (sketchContainer.offsetWidth <= sketchContainer.offsetHeight) {
            p.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetWidth)
        } else {
            p.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetHeight)
        }
        p.init()
    }

    p.init = () => {}

    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        console.log(newProps)
    }

    p.draw = () => {}
}
