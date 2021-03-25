/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID) => (p) => {
    const squareSize = 50
    let cube = []

    p.setup = () => {
        p.createCanvas(width, height, p.WEBGL)
        setTimeout(() => {
            p.windowResized()
        }, 10)
    }

    p.windowResized = function () {
        p.resizeCanvas(document.getElementById(parentDivID).offsetWidth, document.getElementById(parentDivID).offsetHeight)
        p.init()
    }

    p.init = () => {
        cube = []
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    let color1 = ''
                    let color2 = ''
                    let color3 = ''
                    if (z == 0) {
                        color1 = '#00ff00'
                    } else if (z == 1) {
                        color1 = '#000000'
                    } else if (z == 2) {
                        color1 = '#ffff00'
                    }
                    if (y == 0) {
                        color2 = '#0000ff'
                    } else if (y == 1) {
                        color2 = '#000000'
                    } else if (y == 2) {
                        color2 = '#ffffff'
                    }
                    if (x == 0) {
                        color3 = '#ff0000'
                    } else if (x == 1) {
                        color3 = '#000000'
                    } else if (x == 2) {
                        color3 = '#ffa500'
                    }
                    let box = new Box(color1, color2, color3, x * squareSize, y * squareSize, z * squareSize)
                    cube.push(box)
                }
            }
        }
    }

    p.keyPressed = () => {
        if (p.keyCode == 32) {
            //
        }
        if (p.keyCode == 'F'.charCodeAt(0)) {
            // face is all cubes with z = 0
            let face = cube.filter((val, idx, arr) => val.z == 0)
        }
    }

    p.draw = () => {
        p.background(51)
        p.rotateY((p.mouseX * Math.PI * 2) / p.width)
        p.rotateX((p.mouseY * Math.PI * 2) / p.height)
        p.translate(-squareSize, -squareSize, -squareSize)
        for (let cublet of cube) {
            cublet.show()
        }
    }

    class Box {
        constructor(color1, color2, color3, x, y, z) {
            this.colors = [color1, color2, color3]
            this.x = x
            this.y = y
            this.z = z
        }

        show = () => {
            p.push()
            p.translate(this.x, this.y, this.z)
            for (let w = 0; w < 3; w++) {
                p.push()
                p.fill(this.colors[w])
                if (w == 1) {
                    p.rotateX(Math.PI / 2)
                } else if (w == 2) {
                    p.rotateY(Math.PI / 2)
                }
                p.translate(0, 0, squareSize / 2)
                p.plane(squareSize, squareSize)
                p.translate(0, 0, -squareSize)
                p.plane(squareSize, squareSize)
                p.pop()
            }
            p.pop()
        }
    }
}
