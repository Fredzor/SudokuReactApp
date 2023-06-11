import React, { useEffect } from 'react';

export default function SudokuGrid(props) {

    // create blank grids
    const [initgrid, initPossibilitesGrid, defaultNumberGrid] = [[],[],[]];
    const [numRows, numCols] = [9, 9];
    for (let i = 0; i < numRows; i++) {
        initgrid[i] = [];
        defaultNumberGrid[i] = [];
        initPossibilitesGrid[i] = [];
        for (let j = 0; j < numCols; j++) {
            initgrid[i][j] = "";
            defaultNumberGrid[i][j] = false;
            initPossibilitesGrid[i][j] = {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false,
            };
        }
    }

    // true: fill cells with numbers ; false: fill possibilities of cell
    const [fillOrPen, setfillOrPen] = React.useState(true);
    // true: insert currently active number by clicking on the cell ; false: insert number by clicking cell and number-button afterwards
    const [fastOrSlowMode, setfastOrSlowMode] = React.useState(true);
    // keeps track of the curerntly active number (in case fastOrSlowMode is set to true)
    const [activeNumber, setactiveNumber] = React.useState(1);
    // keeps track of the active cell
    const [activeCell, setactiveCell] = React.useState([0,0]);
    // keeps track of the history of the game (first param: value-array, second param: possibilities array)
    const [valueHistory, setvalueHistory] = React.useState([initgrid]);
    const [possibilitiesHistory, setpossibilitiesHistory] = React.useState([initPossibilitesGrid]);
    // database id's of sudoku
    const [sudokuID, setsudokuID] = React.useState(0);
    // the finished sudoku
    const [finishedSudoku, setfinishedSudoku] = React.useState([]);
    // current game-state
    const grid = valueHistory[valueHistory.length-1];
    const possibilitiesGrid = possibilitiesHistory[possibilitiesHistory.length-1];
    // true if the sudoku has been completed
    const gameComplete = JSON.stringify(finishedSudoku) == JSON.stringify(valueHistory[valueHistory.length - 1]);

    // id of the playedSudoku-Instance on the db
    const [playedSudokuID, setplayedSudokoID] = React.useState(props.playedSudoku != null? props.playedSudoku.id : null);

    // time at which you started playing the sudoku on this session
    const [secondsPlayed, setsecondsPlayed] = React.useState(props.playedSudoku != null? props.playedSudoku.timePlayed : 0)

    function convertNumToTimeFormat(num) {
        let mins = Math.floor(num/60)
        let secs = num % 60
        return `${mins < 10? 0:''}${mins}:${secs < 10? 0:''}${secs}`
    }
    let timePlayedDisplayed = convertNumToTimeFormat(secondsPlayed)

    // Create a playedSudoku-Instance
    React.useEffect(getSudoku, []);
    function getSudoku() {
        let csrftoken = props.getCookie('csrftoken');
        // gets executed only if you want to start a new sudoku
        if (props.playedSudoku == null) {
            var url = 'http://127.0.0.1:8000/sodoku/createPlayedSudokuInstance'
            const sudokuData = fetch(url,
                {
                    method: 'POST',
                    mode: "cors",
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': csrftoken,
                    },
                    body: JSON.stringify({
                        difficulty: props.difficulty
                    })
                })
                .then((response)=> {
                    return response.json()
                })
                .then((data)=> {
                    setplayedSudokoID(data.id)
                    setvalueHistory(data.sudokuObjectvalueHistory)
                    setpossibilitiesHistory(data.sudokuObjectpossiblitiesHistory)
                    setfinishedSudoku(data.finishedSudoku[0])
                    setsecondsPlayed(data.timePlayed)
                    console.log('instance has been created with received data-id', data.id, 'and the active state (playedSudokuID: ', playedSudokuID)
                })

        } else if (props.playedSudoku != null) {
            // the playedSudoku-instance got passed via props (the instance has been received on the previous component)
            setplayedSudokoID(props.playedSudoku.id)
            setvalueHistory(props.playedSudoku.sudokuObjectvalueHistory)
            setpossibilitiesHistory(props.playedSudoku.sudokuObjectpossiblitiesHistory)
            setfinishedSudoku(props.playedSudoku.finishedSudoku[0])
        }
    }


    React.useEffect(() => {
        const interval = setInterval(() => {
            setsecondsPlayed(seconds => seconds + 1);

        }, 1000);
        return () => clearInterval(interval);
      }, []);
    

    // Update the db whenever you change the sudoku
    React.useEffect(updatePlayedSudoku, [valueHistory, possibilitiesHistory]);
    function updatePlayedSudoku() {
        if (playedSudokuID != null) {
            // wait until a playedSudokuID has been set
            let csrftoken = props.getCookie('csrftoken');
            var url = 'http://127.0.0.1:8000/sodoku/playedSudokuUpdateView'
            fetch(url,
                {
                    method: 'POST',
                    mode: "cors",
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': csrftoken,
                    },
                    body: JSON.stringify({
                        sudokuObjectvalueHistory: valueHistory,
                        sudokuObjectpossiblitiesHistory: possibilitiesHistory,
                        sudokuProgressState: gameComplete,
                        timePlayed: secondsPlayed,
                        id: playedSudokuID,
                    })
                })
            .then((response)=>response.json())
            .then((data)=> {
                console.log('data after updating:', data)
            })
        } 
    }

    // return to last history-timestamp
    function jumpBackInTime(){
        if (valueHistory.length > 1) {
            setvalueHistory((oldHistory)=>{
                const newHistory = [...oldHistory];
                newHistory.pop();
                return newHistory
            });
            setpossibilitiesHistory((oldHistory)=>{
                const newHistory = [...oldHistory];
                newHistory.pop();
                return newHistory
            })
        }
    }

    function handleChange(event) {
        // why slice(-1)? if there was already a number in the cell (e.g.: 4) and you press e.g.: 6 -> then the value would be "46".
        // since you only want to use the last number (6) you only take 6 into account
        const value = event.target.value.slice(-1)
        const {rowidx, colidx} = event.target.attributes;

        if (!isNaN(value) && value != "0") {
            if (fillOrPen) {
                setvalueHistory((oldHistory)=> {
                    let newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    newGrid[rowidx.value][colidx.value] = value;
                    let newHistory = [...oldHistory, newGrid]
                    return newHistory;
                })
            } else if (!fillOrPen) {
                setpossibilitiesHistory((oldHistory)=> {
                    let newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    newGrid[rowidx.value][colidx.value][value] = !newGrid[rowidx.value][colidx.value][value];
                    let newHistory = [...oldHistory, newGrid]
                    return newHistory;
                })
            }
        }
    }

    function toggleFillOrPen() {
        setfillOrPen((oldValue)=> {return !oldValue})
    }

    function toggleFastOrSlowMode() {
        setfastOrSlowMode((oldValue)=> {return !oldValue})
    }

    function handleClick(e) {
        const {rowidx, colidx} = e.target.attributes;
        setactiveCell([Number(rowidx.value), Number(colidx.value)]);
        // do nothing if the cell has been filled from the start
        if (valueHistory[0][Number(rowidx.value)][Number(colidx.value)] != 0 ) {
            return 
        }
        // if fast mode is active
        if (fastOrSlowMode) {
            // if fast mode is active && fill-mode is active
            if (fillOrPen) {
                setvalueHistory((oldHistory)=>{
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    newGrid[Number(rowidx.value)][Number(colidx.value)] == activeNumber ? newGrid[Number(rowidx.value)][Number(colidx.value)] = 0: newGrid[Number(rowidx.value)][Number(colidx.value)] = activeNumber;
                    let newHistory = [...oldHistory, newGrid];
                    return newHistory;
                })
                setpossibilitiesHistory((oldHistory)=>{
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    let newHistory = [...oldHistory, newGrid]
                    return newHistory;
 
                })
            // if fast mode is active && pen-mode is active
            } else if (!fillOrPen) {
                setpossibilitiesHistory((oldHistory)=>{
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    newGrid[Number(rowidx.value)][Number(colidx.value)][activeNumber] = !newGrid[Number(rowidx.value)][Number(colidx.value)][activeNumber];
                    let newHistory = [...oldHistory, newGrid]
                    return newHistory;
                })
                setvalueHistory((oldHistory)=>{
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    let newHistory = [...oldHistory, newGrid];
                    return newHistory;
                })
            }
        } 
    }

    

    function handleClickNumberButton(e) {
        setactiveNumber(Number(e.target.innerHTML));

        // do nothing if the cell has been filled from the start
        if (valueHistory[0][activeCell[0]][activeCell[1]] != 0 ) {
            return
        }

        // only if you are in slow mode and you have focus on a cell inside the sudoku
        if (!fastOrSlowMode && activeCell != null) {
            // only if you are in fill mode
            if (fillOrPen) {
                setvalueHistory((oldHistory)=> {
                    const num = Number(e.target.innerHTML);
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    newGrid[activeCell[0]][activeCell[1]] == num ? newGrid[activeCell[0]][activeCell[1]] = 0: newGrid[activeCell[0]][activeCell[1]] = num;
                    let newHistory = [...oldHistory, newGrid];
                    return newHistory
                })
                // copies the last entry of possibilities-history since only the value-array gets edited
                setpossibilitiesHistory((oldHistory)=>{
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    let newHistory = [...oldHistory, newGrid];
                    return newHistory
                })
            } else if (!fillOrPen) {
                // only if you are in pencil mode
                // updates the possibilities-array
                setpossibilitiesHistory((oldHistory)=>{
                    const num = Number(e.target.innerHTML);
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    newGrid[activeCell[0]][activeCell[1]][num] = !newGrid[activeCell[0]][activeCell[1]][num];
                    let newHistory = [...oldHistory, newGrid];
                    return newHistory
                })
                // copies the last entry of value-history since only the possibilites get edited
                setvalueHistory((oldHistory)=> {
                    const newGrid = structuredClone(oldHistory[oldHistory.length - 1]);
                    let newHistory = [...oldHistory, newGrid];
                    return newHistory
                })
            }
        }
    }

    // creates the sudoku-grid
    function createSudoku() {
        const linearizedGrid = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                linearizedGrid.push(grid[i][j])
            }
        }
    
        const activeCellRowBlock = Math.floor(activeCell[0] / 3);
        const activeCellColBlock = Math.floor(activeCell[1] / 3);
    
        const displayLinearizedGrid = linearizedGrid.map((cell, idx)=>{
            let rowidx = Math.floor(idx / 9);
            let colidx = idx % 9;
            let rowBlock = Math.floor(rowidx / 3);
            let colBlock = Math.floor(colidx / 3);
            return (
                <div className={"cellContainer"
                        + ' ' + ((rowidx == activeCell[0] && colidx != activeCell[1])? 'rowActiveCell' : '')
                        + ' ' + ((colidx == activeCell[1] && rowidx != activeCell[0])? 'colActiveCell' : '')
                        + ' ' + ((rowBlock == activeCellRowBlock && colBlock == activeCellColBlock)? 'activeBlockCell': '')
                        + ' ' + ((rowidx == activeCell[0] && colidx == activeCell[1]) ? 'activeCell':'')
                        }
                        key={idx}>
    
                    <div className={"possibleNumber one"
                    + ' ' + ((activeNumber == 1 && possibilitiesGrid[rowidx][colidx][1])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][1]? 1 : ''}</div>
                    <div className={"possibleNumber two"
                    + ' ' + ((activeNumber == 2 && possibilitiesGrid[rowidx][colidx][2])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][2]? 2 : ''}</div>
                    <div className={"possibleNumber three"
                    + ' ' + ((activeNumber == 3 && possibilitiesGrid[rowidx][colidx][3])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][3]? 3 : ''}</div>
                    <div className={"possibleNumber four"
                    + ' ' + ((activeNumber == 4 && possibilitiesGrid[rowidx][colidx][4])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][4]? 4 : ''}</div>
                    <div className={"possibleNumber five"
                    + ' ' + ((activeNumber == 5 && possibilitiesGrid[rowidx][colidx][5])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][5]? 5 : ''}</div>
                    <div className={"possibleNumber six"
                    + ' ' + ((activeNumber == 6 && possibilitiesGrid[rowidx][colidx][6])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][6]? 6 : ''}</div>
                    <div className={"possibleNumber seven"
                    + ' ' + ((activeNumber == 7 && possibilitiesGrid[rowidx][colidx][7])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][7]? 7 : ''}</div>
                    <div className={"possibleNumber eight"
                    + ' ' + ((activeNumber == 8 && possibilitiesGrid[rowidx][colidx][8])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][8]? 8 : ''}</div>
                    <div className={"possibleNumber nine"
                    + ' ' + ((activeNumber == 9 && possibilitiesGrid[rowidx][colidx][9])? 'numberActive': '')
                    }>{possibilitiesGrid[rowidx][colidx][9]? 9 : ''}</div>
    
                    <input type="text"
                        name={rowidx.toString() + colidx.toString()}
                        value={linearizedGrid[idx] != 0? linearizedGrid[idx]: ""}
                        rowidx={rowidx}
                        colidx={colidx}
                        onChange={handleChange}
                        onClick={handleClick}
                        className= {"sudokuCell" 
                        + ' ' + (linearizedGrid[idx] != 0? 'filled': '')    
                        + ' ' + (colidx % 3 == 0 ? 'leftBorder': '') 
                        + ' ' + (rowidx % 3 == 0 ? 'topBorder' : '') 
                        + ' ' + ((rowidx == activeCell[0] && colidx != activeCell[1])? 'rowActiveCell' : '')
                        + ' ' + ((colidx == activeCell[1] && rowidx != activeCell[0])? 'colActiveCell' : '')
                        + ' ' + ((rowBlock == activeCellRowBlock && colBlock == activeCellColBlock)? 'activeBlockCell': '')
                        + ' ' + ((rowidx == activeCell[0] && colidx == activeCell[1]) ? 'activeCell':'')
                        + ' ' + ((activeNumber == linearizedGrid[idx] && (rowidx != activeCell[0] | colidx != activeCell[1]))? 'numberActive': '')
                        }/>
                </div>
                )
        })
        return displayLinearizedGrid
    }

    const displayLinearizedGrid = createSudoku()
    

    return(
        <div className="playContainer">
            {gameComplete && 
            <div>
                <h1>Congratulations - you have finsihed the sudoku</h1> 
                <button onClick= {props.handleClickChooseDifficulty}>Play another one?</button>
                <button onClick= {props.handleClickAnalyze}>Watch History?</button>

            </div>
            }
            <div>{gameComplete && 'The game is finished'}</div>
            <div>Difficulty: {props.difficulty}</div>
            <h1>Navigation</h1>
            <div className="buttonContainer">
                <button onClick={props.handleClickChooseDifficulty}>Play a different Sudoku? </button>
                <button onClick={props.handleClickAnalyze}>See history </button>
            </div>
            <div className="buttonContainer">

                {/* change between fill or pen */}
                <button onClick={toggleFillOrPen}>
                    <svg className={"svgButton" + ' ' + (!fillOrPen? 'active': '')} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                </button>
                {/* change between fast or slow mode */}
                <button onClick={toggleFastOrSlowMode}>
                    <svg className={"svgButton" + ' ' + (fastOrSlowMode? 'active': '')} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path fill="currentColor" d="M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z"/></svg>
                </button>
                <button onClick={jumpBackInTime}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"/></svg>
                </button>
            </div>
            <div>
                Time played: {timePlayedDisplayed}
            </div>
            
            <div className="numberContainer">
                <button onClick={(e)=>{handleClickNumberButton(e)}}
                className={activeNumber == 0? 'activeNumber': ''}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path fill="currentColor" d="M290.7 57.4L57.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H288h9.4H512c17.7 0 32-14.3 32-32s-14.3-32-32-32H387.9L518.6 285.3c25-25 25-65.5 0-90.5L381.3 57.4c-25-25-65.5-25-90.5 0zM297.4 416H288l-105.4 0-80-80L227.3 211.3 364.7 348.7 297.4 416z"/></svg>
                </button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==1? 'activeNumber':''}>1</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==2? 'activeNumber':''}>2</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==3? 'activeNumber':''}>3</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==4? 'activeNumber':''}>4</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==5? 'activeNumber':''}>5</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==6? 'activeNumber':''}>6</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==7? 'activeNumber':''}>7</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==8? 'activeNumber':''}>8</button>
                <button onClick={(e)=>{handleClickNumberButton(e)}} className={activeNumber==9? 'activeNumber':''}>9</button>
            </div>

            <div className="sudokuContainer">{displayLinearizedGrid}</div>
        </div>


    )
}


    // to do:
    // possibilities-state
    // constant input numbers (given from the start/get-go)
    // when trying to enter a number to the grid or the possiblities-state which is not possible, then:
    //      highlight why it is not possible
    //      make the input-field blink red until you either change focus or put in a different number
    //      have a return button -> to get to a previous state
    // create a new sodoku (either take a different one from a database or create one in real time)
    // have a winning-condition -> if sodoku is completely filled then show so
    // have a function which automatically solves the sodoku (recursion)
    // save the completed sodokus to a db and show the history of the finished sodokus