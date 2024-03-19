
import { bugService } from './services/bug.service.js';
import { loggerService } from './services/logger.service.js';

import cookieParser from 'cookie-parser';
import express from 'express'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

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
    console.log(req.body);
    const filterBy = {
        title: req.query.title || '',
        // description:req.query.description||'',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: req.query.pageIdx
    }
    console.log(filterBy);
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bugs')
        })
})

// create bug
app.post('/api/bug', (req, res) => {
    const bugToSave = req.body

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error("Cannot save bug", err)
            res.status(400).send("Cannot save bug")
        })
})

// update bug
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        _id: req.body._id,
        createdAt: req.body.createdAt
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error("Cannot save bug", err)
            res.status(400).send("Cannot save bug")
        })
})



app.get("/api/bug/:bugId", (req, res) => {
    const { bugId } = req.params
    const { visitedBugs = [] } = req.cookies


    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit')
        else visitedBugs.push(bugId)
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })


    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
            // res.status(403).send(err)
        })


})


//Remove Bug
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
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

// http://127.0.0.1:3040