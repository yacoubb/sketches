/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID) => (p) => {
    var sketchContainer
    var maxR = 0
    // var radii = [0.3, 0.5, 0.7, 0.9];
    var radii = [0.3, 0.4, 0.5, 0.7, 0.9]
    var patterns = []
    var patternFunctions = [arc, wiggle, lines, triangles, littleArrow, bigArrow, bigCircles, littleCircles, slant, boxes]
    var mag = maxR / 100

    p.setup = () => {
        sketchContainer = document.getElementById(parentDivID)
        const canvas = p.createCanvas(width, height)

        p.noLoop()
        setTimeout(() => {
            p.windowResized()
            // p.loop();
        }, 10)
    }

    p.keyPressed = function () {
        if (p.keyCode == 82) {
            p.windowResized()
        }
    }

    p.windowResized = function () {
        if (sketchContainer.offsetWidth <= sketchContainer.offsetHeight) {
            p.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetWidth)
        } else {
            p.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetHeight)
        }
        maxR = Math.min(p.width, p.height)
        mag = maxR / 100
        p.init()
    }

    p.init = () => {
        console.log('init')
        patterns = []
        // var seed = Math.floor(p.random(0, 400));
        var seed = new Date().valueOf()
        // seed = 220;
        p.noiseSeed(seed)
        for (var i = 0; i < radii.length; i++) {
            var n = (radii[i] * maxR) / 16
            var pattern = []
            // iterating across segments in the circle
            for (var s = 0; s < n; s++) {
                var x = Math.cos((s / n) * Math.PI * 2)
                var y = Math.sin((s / n) * Math.PI * 2)
                var z = p.noise(x + i * 2, y + i * 2)
                pattern.push(z)
            }
            var min = Math.min(...pattern)
            var max = Math.max(...pattern)
            for (var s = 0; s < n; s++) {
                var mapped = p.map(pattern[s], min, max, 0, patternFunctions.length - 0.001)
                pattern[s] = Math.floor(mapped)
            }
            patterns.push(pattern)
        }
        p.redraw()
    }

    p.draw = () => {
        p.rectMode(p.CENTER)
        p.background('#fafaff')
        p.translate(p.width / 2, p.height / 2)
        p.noFill()
        for (var i = 0; i < patterns.length; i++) {
            var n = patterns[i].length
            var r = radii[i] * maxR
            // p.rotate((i + 1) * p.frameCount * 0.01 * Math.pow(-1, i));
            // console.log(patterns[i]);
            // iterating across segments in the circle
            for (var s = 0; s < n; s++) {
                var theta = (s / n) * Math.PI * 2
                var inc = (1 / n) * Math.PI * 2
                p.stroke(100)
                patternFunctions[patterns[i][s]](i, n, r, s, theta)
                p.stroke(0, 255, 0)
                var delta = 4 / r
                // p.arc(0, 0, r - 10, r - 10, theta + delta, theta + inc - delta);
                // p.arc(0, 0, r + 10, r + 10, theta + delta, theta + inc - delta);
            }
        }
    }

    function arc(i, n, r, s, theta) {
        var resolution = 100
        p.beginShape()
        for (var j = 0; j <= resolution; j++) {
            var jTheta = (j / resolution) * Math.PI * 2
            var rr = r / 2
            var x = Math.cos(theta + jTheta / n) * rr
            var y = Math.sin(theta + jTheta / n) * rr
            p.vertex(x, y)
        }
        p.endShape()
    }

    function lines(i, n, r, s, theta) {
        var resolution = 6
        for (var j = 0; j <= resolution; j++) {
            var mmag = mag * 0.5
            if (j % resolution == 0) {
                mmag = mag * 1.2
            }
            var jTheta = (j / resolution) * Math.PI * 2
            var x = Math.cos(theta + jTheta / n)
            var y = Math.sin(theta + jTheta / n)
            p.line((x * (r - mmag)) / 2, (y * (r - mmag)) / 2, (x * (r + mmag)) / 2, (y * (r + mmag)) / 2)
        }
    }

    function wiggle(i, n, r, s, theta) {
        var resolution = 100
        p.beginShape()
        for (var j = 0; j <= resolution; j++) {
            var mmag = mag * 0.5
            var jTheta = (j / resolution) * Math.PI * 2
            var rr = r / 2 + Math.sin(jTheta) * mmag
            var x = Math.cos(theta + jTheta / n) * rr
            var y = Math.sin(theta + jTheta / n) * rr
            p.vertex(x, y)
        }
        p.endShape()
    }
    function triangles(i, n, r, s, theta) {
        var resolution = 6
        for (var j = 0; j <= resolution; j++) {
            var mmag = mag * 0.5
            if (j % resolution == 0) {
                var adjacentSectionS = s + (j == 0 ? -1 : 1)
                adjacentSectionS = (adjacentSectionS + n) % n
                if (patterns[i][adjacentSectionS] < patterns[i][s]) {
                    continue
                }
            }
            var jTheta = (j / resolution) * Math.PI * 2
            var x = (Math.cos(theta + jTheta / n) * r) / 2
            var y = (Math.sin(theta + jTheta / n) * r) / 2
            p.push()
            p.translate(x, y)
            p.rotate(theta + (j / resolution / n) * Math.PI * 2)
            var tmag = j % 2 ? mmag : -mmag
            p.triangle(0, -mmag, 0, mmag, tmag, 0)
            p.pop()
        }
    }
    function littleArrow(i, n, r, s, theta) {
        var resolution = 6
        for (var j = 0; j <= resolution; j++) {
            var mmag = mag * 0.4
            if (j % resolution == 0) {
                var adjacentSectionS = s + (j == 0 ? -1 : 1)
                adjacentSectionS = (adjacentSectionS + n) % n
                if (patterns[i][adjacentSectionS] < patterns[i][s]) {
                    continue
                }
            }
            var jTheta = (j / resolution) * Math.PI * 2
            var x = (Math.cos(theta + jTheta / n) * r) / 2
            var y = (Math.sin(theta + jTheta / n) * r) / 2
            p.push()
            p.translate(x, y)
            p.rotate(theta + (j / resolution / n) * Math.PI * 2 - Math.PI / 2)
            p.line(mmag, -mmag / 2, 0, mmag / 2)
            p.line(-mmag, -mmag / 2, 0, mmag / 2)
            p.pop()
        }
    }

    function bigArrow(i, n, r, s, theta) {
        var resolution = 3
        for (var j = 0; j <= resolution; j++) {
            var mmag = mag * 0.8
            if (j % resolution == 0) {
                var adjacentSectionS = s + (j == 0 ? -1 : 1)
                adjacentSectionS = (adjacentSectionS + n) % n
                if (patterns[i][adjacentSectionS] != patterns[i][s]) {
                    continue
                }
            }
            var jTheta = (j / resolution) * Math.PI * 2
            var x = (Math.cos(theta + jTheta / n) * r) / 2
            var y = (Math.sin(theta + jTheta / n) * r) / 2
            p.push()
            p.translate(x, y)
            p.rotate(theta + (j / resolution / n) * Math.PI * 2 - Math.PI / 2)
            p.line(mmag, -mmag / 2, 0, mmag / 2)
            p.line(-mmag, -mmag / 2, 0, mmag / 2)
            p.pop()
        }
    }

    function boxes(i, n, r, s, theta) {
        var resolution = 3
        for (var j = 0; j <= resolution; j++) {
            if (j % resolution == 0) {
                var adjacentSectionS = s + (j == 0 ? -1 : 1)
                adjacentSectionS = (adjacentSectionS + n) % n
                if (patterns[i][adjacentSectionS] < patterns[i][s]) {
                    // draw a line
                    var mmag = mag
                    var jTheta = (j / resolution) * Math.PI * 2
                    var x = Math.cos(theta + jTheta / n)
                    var y = Math.sin(theta + jTheta / n)
                    p.line((x * (r - mmag)) / 2, (y * (r - mmag)) / 2, (x * (r + mmag)) / 2, (y * (r + mmag)) / 2)
                    continue
                }
            }
            var jTheta = (j / resolution) * Math.PI * 2
            var jTheta = (j / resolution) * Math.PI * 2
            var x = (Math.cos(theta + jTheta / n) * r) / 2
            var y = (Math.sin(theta + jTheta / n) * r) / 2
            p.push()
            p.translate(x, y)
            p.rotate(theta + jTheta / n)
            p.rect(0, 0, mag, mag)
            p.pop()
        }
    }

    function slant(i, n, r, s, theta) {
        var resolution = 10
        var delta = 0.01
        for (var j = 0; j <= resolution; j++) {
            if (j % resolution == 0) {
                var adjacentSectionS = s + (j == 0 ? -1 : 1)
                adjacentSectionS = (adjacentSectionS + n) % n
                if (patterns[i][adjacentSectionS] != patterns[i][s]) {
                    continue
                }
            }
            var mmag = mag * 0.5
            var jTheta = (j / resolution) * Math.PI * 2
            var x1 = Math.cos(theta + jTheta / n + delta)
            var y1 = Math.sin(theta + jTheta / n + delta)
            var x2 = Math.cos(theta + jTheta / n - delta)
            var y2 = Math.sin(theta + jTheta / n - delta)
            p.line((x1 * (r - mmag)) / 2, (y1 * (r - mmag)) / 2, (x2 * (r + mmag)) / 2, (y2 * (r + mmag)) / 2)
        }
    }

    function bigCircles(i, n, r, s, theta) {
        var resolution = 2
        for (var j = 0; j <= resolution; j++) {
            if (j % resolution == 0) {
                var adjacentSectionS = s + (j == 0 ? -1 : 1)
                adjacentSectionS = (adjacentSectionS + n) % n
                if (patterns[i][adjacentSectionS] != patterns[i][s]) {
                    continue
                }
            }
            var mmag = mag
            var jTheta = (j / resolution) * Math.PI * 2
            var x = (Math.cos(theta + jTheta / n) * r) / 2
            var y = (Math.sin(theta + jTheta / n) * r) / 2
            p.circle(x, y, mmag)
        }
    }

    function littleCircles(i, n, r, s, theta) {
        var resolution = 8
        for (var j = 0; j <= resolution; j++) {
            if (j < 1 || j > resolution - 1) {
                var adjacentSectionS = s + (j == 0 ? -1 : 1)
                adjacentSectionS = (adjacentSectionS + n) % n
                if (patterns[i][adjacentSectionS] != patterns[i][s]) {
                    continue
                }
            }
            var mmag = mag * 0.5
            var jTheta = (j / resolution) * Math.PI * 2
            var x = (Math.cos(theta + jTheta / n) * r) / 2
            var y = (Math.sin(theta + jTheta / n) * r) / 2
            p.circle(x, y, mmag)
        }
    }
}
