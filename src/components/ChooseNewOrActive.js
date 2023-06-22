import React from 'react'


export default function ChooseNewOrActive(props) {

    const [playedSudoku, setPlayedSudoku] = React.useState([])
    React.useEffect(getData, [])

    function getData() {
        let csrftoken = props.authCookie;
        fetch('https://www.frederik-bergs.com/sodoku/getActivePlayedSudokus',
        {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                difficulty: props.difficulty,
            })
        })
        .then((data)=> {
            return data.json()
        })
        .then((data) => {
            setPlayedSudoku(data)
        })
    }

    function handleClickPlayNewSudoku(playsud) {
        props.handleClickPlaySudoku();
        props.setplayedSudoku(playsud);
    }


    

    const playedSudokusSVG = playedSudoku.map((playsud)=> {
        return (
            <div key= {playsud.id}>
                <button onClick= {()=>{handleClickPlayNewSudoku(playsud)}}>Resume to Sudoku {playsud.id}</button>
            </div>
        )
    })

    return (

        <div className='settingsContainer'>
            {playedSudoku.length > 0 && <h1>Return to unfinished games</h1>}
            {playedSudokusSVG}
            <h1>Play a new sudoku</h1>
            <button onClick= {()=>{handleClickPlayNewSudoku(null)}}>play a new Sudoku</button>
        </div>


    )


    // return (
    //     <div className='settingsContainer'>
    //         <h1>Choose Difficulty</h1>
    //         <button onClick = {()=>{
    //             props.setProgramState('ChooseNewOrActive');
    //             props.setDifficulty('Easy');
    //             }}>Easy
    //         </button>
    //         <button onClick = {()=>{
    //             props.setProgramState('ChooseNewOrActive');
    //             props.setDifficulty('Medium');
    //             }}>Medium
    //         </button>
    //         <button onClick = {()=>{
    //             props.setProgramState('ChooseNewOrActive');
    //             props.setDifficulty('Hard');
    //             }}>Hard
    //         </button>
    //         <button onClick = {()=>{
    //             props.setProgramState('ChoosePlayOrAnalyze');
    //             props.setDifficulty('Hard');
    //             }}>Return
    //         </button>
    //     </div>
    // )

}
