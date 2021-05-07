/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID) => (p) => {
    var running = true

    var cars = []
    var w = 10
    var fWidth, fHeight
    var field
    var drawArrow = true
    var border = 0.1
    var colors = ['#aabf12', '#33ab12', '#165512', '#fe3fa2', '#a345cd']
    var minR = 10,
        maxR = 40
    var hasClicked = false
    var clickOpacity = 255

    p.setup = () => {
        p.createCanvas(width, height)
        setTimeout(() => {
            p.windowResized()
        }, 10)
    }

    var args = undefined
    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        args = newProps.args
        p.init()
    }

    p.init = () => {
        if (args === undefined || Object.keys(args ?? {}).length === 0) {
            return
        }
        while (cars.length > args.carCount.value) {
            cars.splice(args.carCount.value, cars.length - args.carCount.value)
        }
        const carOpacity = 140
        colors = [
            p.color(255, 255, 0, carOpacity),
            p.color(0, 255, 255, carOpacity),
            p.color(255, 0, 255, carOpacity),
            p.color(255, 0, 0, carOpacity),
            p.color(0, 255, 0, carOpacity),
        ]
        for (var i = cars.length; i < args.carCount.value; i++) {
            cars.push(new p.Car(p.random(p.width), p.random(p.height), p.random(minR, maxR)))
        }
    }

    p.mousePressed = () => {
        hasClicked = true
    }

    p.windowResized = function () {
        p.resizeCanvas(document.getElementById(parentDivID).offsetWidth, document.getElementById(parentDivID).offsetHeight)
    }

    p.draw = () => {
        p.background(51)
        // background('#fafaff');
        if (hasClicked) {
            clickOpacity *= 0.7
        }
        if (clickOpacity > 0) {
            p.textSize(Math.min(p.width, p.height) * 0.15)
            p.noStroke()
            p.fill(0, 255, 255, clickOpacity)
            p.textAlign(p.CENTER, p.CENTER)
            p.text('click and hold', p.width / 2, p.height / 2)
        }
        p.fill(200, 255)

        for (var i = 0; i < cars.length; i++) {
            if (running) {
                cars[i].update()
            }
            cars[i].show()
        }
    }

    p.keyPressed = () => {
        if (p.keyCode == 32) {
            running = !running
        }
    }

    p.squareDist = (x1, y1, x2, y2) => {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
    }

    p.Car = function (x, y, r, colParam) {
        var target = p.createVector(0, 0)
        var power = 100
        var maxSpeed = 80
        var maxForce = 200

        var viewRadius = 70 * 70
        viewRadius = 100 * 100

        this.pos = p.createVector(x, y)
        this.vel = p.createVector(p.random(maxSpeed / 10), p.random(maxSpeed / 10))
        this.acc = p.createVector(0, 0)
        this.r = r
        this.col = colors[Math.floor(Math.random() * colors.length)]

        //var desiredSeperation = this.r * this.r * 4;
        var desiredSeperation = maxR * 2.2 * (maxR * 2.2)

        this.update = function () {
            this.acc = p.createVector(0, 0)
            target = p.createVector(0, 0)
            //if((winMouseX != pwinMouseX || winMouseY != pwinMouseY) && !mouseIsPressed) {
            if (p.mouseIsPressed) {
                this.attract(500)
            }
            //this.seperate(200);
            //this.align(4);
            this.seperateAndAlign(4)

            this.pos.add(this.vel.copy().mult(0.1))
            if (this.pos.x > p.width) {
                this.pos.set(this.pos.x % p.width, this.pos.y)
            } else if (this.pos.x < 0) {
                this.pos.set(this.pos.x + p.width, this.pos.y)
            }
            if (this.pos.y > p.height) {
                this.pos.set(this.pos.x, this.pos.y % p.height)
            } else if (this.pos.y < 0) {
                this.pos.set(this.pos.x, this.pos.y + p.height)
            }
            this.vel.add(this.acc)
            this.vel = this.vel.mult(0.99)
            this.vel.limit(maxSpeed)
        }

        this.applyForce = function (force) {
            this.acc.add(force)
            this.acc.limit(maxForce)
        }

        this.align = function (multiplier) {
            alignmentForce = p.createVector(0, 0)
            var count = 0
            for (var i = 0; i < cars.length; i++) {
                var d = p.squareDist(this.pos.x, this.pos.y, cars[i].pos.x, cars[i].pos.y)
                if (d <= viewRadius) {
                    alignmentForce.add(cars[i].vel)
                    count++
                }
            }
            //alignmentForce.div(count);
            //alignmentForce.add(createVector(random(4), random(4)));
            alignmentForce.normalize().mult(multiplier)
            this.applyForce(alignmentForce)
        }

        this.seperate = function (multiplier) {
            var seperateForce = p.createVector(0, 0)
            var count = 0
            for (var i = 0; i < cars.length; i++) {
                var d = p.squareDist(this.pos.x, this.pos.y, cars[i].pos.x, cars[i].pos.y)
                //desiredSeperation = (this.r + cars[i].r) * (this.r + cars[i].r) * 2;
                if (d > 0 && d < desiredSeperation) {
                    var diff = this.pos.copy().sub(cars[i].pos)
                    //diff.normalize();
                    diff.div(d)
                    seperateForce.add(diff)
                    count++
                }
            }
            seperateForce.mult(multiplier)
            this.applyForce(seperateForce)
        }

        this.seperateAndAlign = function (multiplier) {
            var seperateForce = p.createVector(0, 0)
            var alignmentForce = p.createVector(0, 0)
            var count = 0
            for (var i = 0; i < cars.length; i++) {
                var d = p.squareDist(this.pos.x, this.pos.y, cars[i].pos.x, cars[i].pos.y)
                if (d > 0) {
                    if (d <= viewRadius) {
                        alignmentForce.add(cars[i].vel)
                        count++
                        if (d < desiredSeperation) {
                            var diff = this.pos.copy().sub(cars[i].pos)
                            //diff.normalize();
                            diff.div(d)
                            seperateForce.add(diff)
                        }
                    }
                }
            }
            seperateForce.mult(multiplier * 50)
            this.applyForce(seperateForce)
            alignmentForce.normalize().mult(multiplier)
            this.applyForce(alignmentForce)
        }

        this.attract = function (multiplier) {
            var attractForce = this.pos.copy().sub(p.createVector(p.mouseX, p.mouseY))
            var d = p.squareDist(this.pos.x, this.pos.y, p.mouseX, p.mouseY)
            attractForce.normalize()
            attractForce.div(p.sqrt(d))
            attractForce.mult(multiplier)
            this.applyForce(attractForce)
        }

        this.show = function () {
            p.noStroke()
            p.fill(this.col)
            const realX = this.pos.x * (1 + border) - (border * p.width) / 2
            const realY = this.pos.y * (1 + border) - (border * p.height) / 2
            p.ellipse(realX, realY, 2 * r, 2 * r)
            if (drawArrow) {
                p.stroke(this.col)
                p.strokeWeight(2)
                p.push()
                p.translate(realX, realY)
                p.rotate(this.vel.heading() - Math.PI / 2)
                //var a = map(this.acc.mag(), this.r / 2, this.r * 2, 0, 255);
                //stroke(255, 255, 0, 70);
                //fill(255, 255, 0, 70);
                p.line(0, 0, 0, 0.5 * this.vel.mag())
                p.translate(0, 0.5 * this.vel.mag())
                p.triangle(0, 10, -5, 0, 5, 0)
                p.pop()
            }
        }
    }
}
