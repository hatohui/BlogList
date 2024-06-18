import { useState , forwardRef, useImperativeHandle} from "react";
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
    const [view, setView] = useState(false)

    const hideWhenVisible = {display: view ? 'none' : ''}
    const showWhenVisible = {display: view ? '' : 'none'}

    const toggleVisibility = () => {
        setView(!view)
    }

    useImperativeHandle(refs, () => { 
        return {
            toggleVisibility
        }
    })

    return <div>
        <div style={hideWhenVisible}>
            <button onClick={toggleVisibility}>{props.label}</button>
        </div>
        <div style={showWhenVisible}>
            {props.children}
            <button onClick={toggleVisibility}>Cancel</button>
        </div>
    </div>
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
    label: PropTypes.string.isRequired
}

export default Togglable