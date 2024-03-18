
import { bugService } from './services/bug.service.js';
import { loggerService } from './services/logger.service.js';

import cookieParser from 'cookie-parser';
import express from 'express'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())

// app.get('/api/bug/:id', (req, res) => {
//     let visitedBugs = req.cookies.visitedBugs || 0
//     if (visitedBugs > 3) return res.send("no more need to wait")
//     console.log(visitedBugs);

//     res.cookie('visitedBugs', ++visitedBugs, { maxAge: 10 * 1000 })

//     res.send(`<h1>Hello Puki ${visitedBugs}</h1>`)
// })


app.get('/', (req, res) => res.send('Hello you!'))

// Get bugs (READ)
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
        _id: req.query._id,
        createdAt: req.query.createdAt
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error("Cannot save bug", err)
            res.status(400).send("Cannot save bug")
        })
})

// app.get("/api/bug/:id", (req, res) => {
//     const bugId = req.params.id
//     let visitedBugs = req.cookies.visitedBugs ? JSON.parse(req.cookies.visitedBugs) : []
//     res.cookie('visitedBugs', visitedBugs, { maxAge: 10 * 1000 })


//     if (!visitedBugs.includes(bugId)) {
//         visitedBugs.push(bugId)

//         if (visitedBugs.length === 3) {
//             return res.status(400).send('Sigh for more..')
//         }
//     }

//     res.cookie('visitedBugs', JSON.stringify(visitedBugs), { maxAge: 10 * 1000 })

//     console.log('user visited:', arrVisited.join(','))

//     bugService.getById(bugId)
//         .then(bug => res.send(bug))
//         .then(res.cookie('visited bugs', visitedBugs))


// })



app.get('/api/bug/:id', (req, res) => {
    let bugCount = req.cookies.bugCount ? parseInt(req.cookies.bugCount) : 0
    let arrVisited = req.cookies.arrVisited ? JSON.parse(req.cookies.arrVisited) : []
    res.cookie('bugCount', ++bugCount, { maxAge: 7 * 1000 })
    res.cookie('arrVisited', JSON.stringify(arrVisited), { maxAge: 7 * 1000 })
    console.log('bugCount:', bugCount)
    if (bugCount >= 3) {
        res.status(401).send('You need to sign in..')
    } else {
        const bugId = req.params.id
        arrVisited.push(bugId)

        console.log('user visited:', arrVisited.join(','))

        bugService.getById(bugId)
            .then(bug => res.send(bug))
            .catch(err => {
                loggerService.error(err)
                res.status(400).send('Cannot get bug')
            })
    }


})




//Remove Bug
app.get('/api/bug/:id/remove', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error("Cannot remove bug", err)
            res.status(400).send("Cannot remove bug")
        })
})

























const port = 3040
app.listen(port, () =>
    loggerService.info("Server listening on port http://127.0.0.1:${port}/")
)