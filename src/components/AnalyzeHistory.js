import React from 'react'
import SudokuContainer from './SudokuContainer'

export default function AnalyzeHistory(props) {

    const [difficulty, setDifficulty] = React.useState('All')
    const [amount, setamount] = React.useState(10)
    const [sortBy, setsortBy] = React.useState('Date finished')
    const [data, setdata] = React.useState([])
    

    React.useEffect(()=>{
        var csrftoken = props.authCookie
        let url = 'https://www.frederik-bergs.com/sodoku/playedSudokuHistory'
        fetch(url, 
            {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    difficulty: difficulty,
                    amount: amount,
                    sortBy: sortBy,
                    playerID: props.playerID
                })
        })
        .then((response)=> response.json())
        .then((data)=> {
            console.log(data);
            setdata(data)
        })
    },
    [difficulty, amount, sortBy]
    )


    const dataJSX = data.map((sudoku)=>{
        return(
            <SudokuContainer sudoku = {sudoku} key={sudoku.id}/>
        )
    })

    function onChangeDifficulty(e) {
        let val = e.target.value;
        setDifficulty(val)
    }
    function onChangeAmount(e) {
        let val = e.target.value;
        setamount(val)
    }
    function onChangeSortBy(e) {
        let val = e.target.value;
        setsortBy(val)
    }

    let time = 0;
    let minTime = 9999999;
    let num = 0;
    for (let i = 0; i < data.length; i ++) {
        time += data[i]['timePlayed']
        num += 1
        if (time < minTime) {
            minTime = time
        }
    }
    
    let avgTime = Math.floor(time / num);
    console.log(time, num, avgTime)
    
    function convertNumToTimeFormat(num) {
        let mins = Math.floor(num/60)
        let secs = num % 60
        return `${mins < 10? 0:''}${mins}:${secs < 10? 0:''}${secs}`
    }
    let avgTimeDisplayed = convertNumToTimeFormat(avgTime)
    let minTimeDisplayed = convertNumToTimeFormat(minTime)

    return(
        <div className="historyContainer">
            <h1>Analyze History Section</h1>
            <form id='playedSudokusForm'></form>

            <div className="analyzeOption">
                <label htmlFor="difficulty">Choose difficulty: </label>
                <select name="difficulty" id="difficulty" form="carform" onChange={onChangeDifficulty}>
                    <option value="All">All</option>
                    <option value="Hard">Hard</option>
                    <option value="Medium">Medium</option>
                    <option value="Easy">Easy</option>

                </select>
            </div>
            
            <div className="analyzeOption">
                <label htmlFor="difficulty">Choose max. number of sudokus to fetch: </label>
                <select name="amount" id="amount" form="carform" onChange={onChangeAmount}>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="All">All</option>
                </select>
            </div>

            <div className="analyzeOption">
                <label htmlFor="difficulty">Choose sorting-criteria: </label>
                <select name="sortBy" id="sortBy" form="carform" onChange={onChangeSortBy}>
                    <option value="Date finished">Date finished</option>
                    <option value="Time needed">Time needed</option>
                    <option value="Difficulty">Difficulty</option>
                </select>
            </div>



            {num> 0 ?
            <div className="highScoreData">
                <div id="averageTime">
                    <div class="description">Average time: </div>
                    <div class="value">{avgTimeDisplayed}</div>
                </div>
                <div id="fastestTime">
                    <div class="description">Record time: </div>
                    <div class="value">{minTimeDisplayed}</div>
                </div>
             </div>
            : ''}

            {num == 0 ? 
            <div>Oops, it seems like you haven't finsihed any sudoku yet. Keep trying!</div>
            : ''}

            <div className="sudokuHistory">
                {dataJSX}
            </div>
        </div>
        
    )
}
