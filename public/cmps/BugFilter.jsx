const { useEffect, useState } = React


export function BugFilter({ onSetFilter, filterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
   
    useEffect(() => {
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function onFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function handleChange({ target }) {
        let { value, name: field, type } = target
        if (type === 'number') value = +value

        setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
    }

    

    return <section>
        <h2>Filter our cars</h2>

        <form onSubmit={onFilter}>
            <label htmlFor="title">Title</label>
            <input type="text"
                id="title"
                name="title"
                value={filterByToEdit.title}
                onChange={handleChange}
                placeholder="By title" />

            <label htmlFor="minSeverity">Min Severity</label>
            <input type="number"
                id="minSeverity"
                name="minSeverity"
                value={filterByToEdit.minSeverity || ''}
                onChange={handleChange}
                placeholder="By min severity"
                min="1"
                max="5" />

            <button>Filter</button>
        </form>
    </section>


}

