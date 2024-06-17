const Button = ({message1, message2, setView, view}) => {
    return <button onClick={() => setView(!view)}>{view ? message1 : message2}</button>
}

export default Button