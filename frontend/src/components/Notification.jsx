const Notification = ({message}) => {
    if (!message) return null
    return <div id="notification">
        <h3>Notification: {message}</h3>
    </div>
}

export default Notification