/// <reference path="../../node_modules/@types/p5/global.d.ts" />
export default (width, height, parentDivID) => (p) => {
    var r = 300
    var points = 40
    var segments = 200

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

    p.init = () => {
        r = Math.min(p.width, p.height) * 0.4
        p.strokeWeight(2)
    }

    p.sigmoid = (x) => {
        return 1 / (1 + Math.exp(-x))
    }

    p.draw = () => {
        p.background(51)
        p.translate(p.width / 2, p.height / 2 + r / 5)
        for (var t = 0; t < points; t++) {
            p.fill(255)
            p.noStroke()
            var x = r * Math.cos((t / points) * p.TAU)
            var y = r * Math.sin((t / points) * p.TAU)
            p.push()
            p.translate(x, y)
            p.ellipse(0, 0, 10, 10)
            p.stroke(255)
            p.noFill()
            p.beginShape()
            for (var s = 0; s < segments; s++) {
                var a = (s / segments) * 10 + p.frameCount * 0.01
                var y = (-s * r) / segments
                var x = (p.sigmoid(s / 10) - 0.5) * (p.noise(a, t) - 0.5) * 200
                // var x = (Math.min(p.frameCount / 300, (3 * s) / segments) * Math.sin((s / segments) * p.TAU + t + p.frameCount * 0.01) * r) / 6;
                p.vertex(x, y)
            }
            p.endShape()
            p.pop()
        }
    }
}
