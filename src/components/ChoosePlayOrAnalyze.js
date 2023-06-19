import React from 'react'


export default function ChoosePlayOrAnalyze(props) {

    React.useEffect(handleUserCreation, [])

    // if a user would get created using a form which gets send via clicking the submit button
    function handleUserCreation() {
        const url = 'frederik-bergs.com/sodoku/createPlayer';
        let csrftoken = props.getCookie('csrftoken');
        fetch(url,
            {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({playerName: ''})
            }
        )
        .then((response) => {
            return response.json()})
        .then((data)=> {
            props.setplayerID(data.id);
        })

    }

    return (
        <div className='settingsContainer'>
            <h1>Choose what to do</h1>
            <button onClick = {props.handleClickChooseDifficulty}>Play Sudoku</button>
            <button onClick = {props.handleClickAnalyze}>See Results</button>    
        </div>
        
    )

}