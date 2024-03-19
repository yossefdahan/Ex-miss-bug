import fs from 'fs'

import { utilService } from "./utils.service.js"
const PAGE_SIZE = 5

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = utilService.readJsonFile('./data/bugs.json')

function query(filterBy, sortBy) {
    let bugsToReturn = bugs

    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regex.test(bug.title))
    }
    if (filterBy.minSeverity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (sortBy === 1) {
        bugsToReturn = bugsToReturn.sort((a, b) => sortBy * (a.severity - b.severity))
    } else {
        bugsToReturn = bugsToReturn.sort((a, b) => sortBy * (a.severity - b.severity))
    }
    if (filterBy.pageIdx !== undefined) {
        const pageIdx = +filterBy.pageIdx
        const startIdx = pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    
    return Promise.resolve(bugsToReturn)
}

function getById(id) {
    const bug = bugs.find(bug => bug._id === id)
    if (!bug) return Promise.reject('bug does not exist!')
    return Promise.resolve(bug)
}

function remove(id) {
    const bugIdx = bugs.findIndex(bug => bug._id === id)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        // bug.title = utilService.makeLorem(2)

        bug._id = utilService.makeId()
        // bug.description = ''
        bug.createdAt = Date.now()
        // bug.severity = utilService.getRandomIntInclusive(1, 5)
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}