import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { utilService } from '../services/util.service.js'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

export function BugIndex() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getFilterFromParams(searchParams))
    const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 500))
    const [sortBy, setSortBy] = useState(bugService.getSortBy())

    useEffect(() => {

        setSearchParams({ filterBy, sortBy })

        loadBugs()
    }, [filterBy, sortBy])

    function onSetFilter(fieldsToUpdate) {
        setFilterBy(prevFilter => {
            if (prevFilter.pageIdx !== undefined) fieldsToUpdate.pageIdx = 0
            return { ...fieldsToUpdate }
        })
    }

    function loadBugs() {
        bugService.query({ filterBy, sortBy })
            .then((bugs) => {

                setBugs(bugs)
            })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        let nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0) nextPageIdx = 0
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: nextPageIdx }))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                showErrorMsg('Cannot remove bug', err)
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Add description of the bug')
        }

        bugService.save(bug)
            .then((savedBug) => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSortBy() {

        if (sortBy.sortBy === 1) {
            setSortBy(prevSort => ({ ...prevSort, sortBy: -1 }))
        } else {
            setSortBy(prevSort => ({ ...prevSort, sortBy: 1 }))
        }
    }

    const { title, minSeverity } = filterBy
    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <section className="pagination">
                    <button onClick={() => onChangePage(-1)}>-</button>
                    <span>{filterBy.pageIdx + 1}</span>
                    <button onClick={() => onChangePage(1)}>+</button>
                </section>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugFilter
                    onSetFilter={debounceOnSetFilter.current}
                    filterBy={{ title, minSeverity }}
                />
                <input type="checkbox"
                    onClick={() => onSortBy()}
                />
                <BugList bugs={bugs}
                    onRemoveBug={onRemoveBug}
                    onEditBug={onEditBug} />
            </main>
        </main>
    )
}
