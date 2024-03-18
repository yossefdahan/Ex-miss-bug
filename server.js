
import { bugService } from './services/bug.service.js';
import { loggerService } from './services/logger.service.js';

import cookieParser from 'cookie-parser';
import express from 'express'

const app = express()

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

app.get("/api/bug/:id", (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send("Cannot get bug")
        })
})

//Remove Bug
app.get('/api/bug/remove/:id', (req, res) => {
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