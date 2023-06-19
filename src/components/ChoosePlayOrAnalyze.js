import React from 'react'


export default function ChoosePlayOrAnalyze(props) {

    React.useEffect(handleUserCreation, [])

    // if a user would get created using a form which gets send via clicking the submit button
    function handleUserCreation() {
        const url = 'https://frederik-bergs.com/sodoku/createPlayer';
        let csrftoken = props.getCookie('csrftoken');
        console.log(csrftoken);
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
            console.log(data);
            props.setplayerID(data.id);
        })
        .catch((error)=> {
            console.log(error)
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