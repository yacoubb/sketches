/// <reference path="../../node_modules/@types/p5/global.d.ts" />

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    var u = 0,
        v = 0
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

export default (width, height, parentDivID) => (p) => {
    var sketchContainer

    const boardWidth = 8
    var forkSources = []
    var forkableSquares = []
    var score = 0

    const lightSquareColor = '#FFFFFF'
    const darkSquareColor = '#000000'

    p.setup = () => {
        sketchContainer = document.getElementById(parentDivID)
        const canvas = p.createCanvas(width, height)

        p.noLoop()
        p.noStroke()
        setTimeout(() => {
            p.windowResized()
        }, 10)
        score = 0
    }

    var args = undefined
    p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        args = newProps.args
        p.init()
    }

    var mouseBoardX = -1
    var mouseBoardY = -1
    var translatePadding = 0
    var cellSize = 0
    p.windowResized = function () {
        if (sketchContainer.offsetWidth <= sketchContainer.offsetHeight) {
            p.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetWidth)
        } else {
            p.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetHeight)
        }
        cellSize = Math.min(p.width, p.height) / boardWidth
        translatePadding = p.width > p.height ? (p.width - p.height) / 2 : 0
        p.init()
    }

    const updateMouse = () => {
        const newX = Math.floor(((p.mouseX - translatePadding) / (p.width - translatePadding * 2)) * boardWidth)
        const newY = Math.floor((p.mouseY / p.height) * boardWidth)

        if (newX !== mouseBoardX || newY !== mouseBoardY) {
            mouseBoardX = newX
            mouseBoardY = newY
            p.draw()
        }
    }

    p.mouseMoved = updateMouse
    p.mouseDragged = updateMouse

    p.mouseClicked = (e) => {
        if (mouseBoardX >= 0 && mouseBoardX < boardWidth && mouseBoardY >= 0 && mouseBoardY < boardWidth) {
            console.log('clicked board')
            console.log(forkSources)
            console.log(mouseBoardX, mouseBoardY)

            if (arrayContainsCoords(forkSources, [mouseBoardX, mouseBoardY])) {
                score++
                args.score.update(score)
            }
            p.init()
        }
    }

    const knightMoves = (x, y) => {
        const hitCoords = []
        for (const offsetX of [-2, -1, 1, 2]) {
            for (const offsetY of [-2, -1, 1, 2]) {
                if (Math.abs(offsetX) == Math.abs(offsetY)) {
                    continue
                }
                hitCoords.push([x + offsetX, y + offsetY])
            }
        }
        return hitCoords.filter((c) => c[0] >= 0 && c[0] < boardWidth && c[1] >= 0 && c[1] < boardWidth)
    }

    const arrayContainsCoords = (arr, coords) => {
        return arr.some((c) => c[0] === coords[0] && c[1] === coords[1])
    }

    p.init = () => {
        const forkX = Math.floor(Math.random() * boardWidth)
        const forkY = Math.floor(Math.random() * boardWidth)

        const hitSquares = knightMoves(forkX, forkY)
        shuffle(hitSquares)
        let forkableCount = Math.ceil(Math.abs(randn_bm())) + 1

        forkableSquares = hitSquares.filter((_, index) => index < forkableCount)
        p.draw()

        // determine fork sources from squares
        const sources = []
        const allSources = []
        for (let i = 0; i < forkableSquares.length; i++) {
            sources.push(knightMoves(forkableSquares[i][0], forkableSquares[i][1]))
            sources[i].map((c) => !arrayContainsCoords(allSources, c) && allSources.push(c)) // spreading the array we JUST pushed into allSources
        }

        forkSources = []
        for (const forkSource of allSources) {
            if (sources.every((sourceList) => arrayContainsCoords(sourceList, forkSource))) {
                forkSources.push(forkSource)
            }
        }

        // console.log(forkSources)
    }

    p.draw = () => {
        if (!!!p) {
            return
        }
        p.background(51, 51, 51)
        p.push()
        p.translate(translatePadding, 0)

        for (let x = 0; x < boardWidth; x++) {
            for (let y = 0; y < boardWidth; y++) {
                let color = (x + y) % 2 === 0 ? lightSquareColor : darkSquareColor
                if (forkableSquares.some((c) => c[0] === x && c[1] === y)) {
                    color = '#FF0000'
                } else if (x === mouseBoardX && y === mouseBoardY) {
                    color = '#00FF00'
                }

                p.fill(color)
                p.rect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
        }
        p.pop()
    }
}
