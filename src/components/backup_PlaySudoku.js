import React, { useEffect } from 'react';

export default function SudokuGrid(props) {

    // defaultNumberGrid: true if this Cell has been filled from the get-go
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
    initgrid[1][1] = 2;
    defaultNumberGrid[1][1] = true;

    // true: fill cells with numbers ; false: fill possibilities of cell
    const [fillOrPen, setfillOrPen] = React.useState(true);
    // true: insert currently active number by clicking on the cell ; false: insert number by clicking cell and number-button afterwards
    const [fastOrSlowMode, setfastOrSlowMode] = React.useState(true);
    // keeps track of the curerntly active number (in case fastOrSlowMode is set to true)
    const [activeNumber, setactiveNumber] = React.useState(0);
    // keeps track of the inserted Numbers
    const [grid, setgrid] = React.useState(initgrid);
    // keeps track of the possibilities of each grid-cell (drawn with pencil)
    const [possibilitiesGrid, setpossibilitiesGrid] = React.useState(initPossibilitesGrid);
    // keeps track of the active cell
    const [activeCell, setactiveCell] = React.useState(null);
    // keeps track of the history of the game (first param: value-array, second param: possibilities array)
    // https://react.dev/learn/tutorial-tic-tac-toe#adding-time-travel
    const [valueHistory, setvalueHistory] = React.useState([]);
    const [possibilitiesHistory, setpossibilitiesHistory] = React.useState([]);

    function updateHistory() {
        setvalueHistory((oldHistory)=>{
            return [...oldHistory,
                    grid]
        });
        setpossibilitiesHistory((oldHistory)=>{
            return [...oldHistory,
                    possibilitiesGrid]
        }
        )
    }

    // keep track of all the changes to the value-grid and possibilities-array;
    useEffect(()=>{
        updateHistory();
    }, [grid, possibilitiesGrid])

    // return to last history-timestamp
    function jumpBackInTime(){
        if (valueHistory.length > 0) {

            const newValueHistory = [...valueHistory];
            newValueHistory.pop();
            const prevValueArray = newValueHistory.pop();
            setvalueHistory(newValueHistory);

            const newPossibilitiesHistory = [...possibilitiesHistory];
            newPossibilitiesHistory.pop();
            const prevPossibilitiesArray = possibilitiesHistory.pop();
            setpossibilitiesHistory(newPossibilitiesHistory);

            setgrid(prevValueArray);
            setpossibilitiesGrid(prevPossibilitiesArray);


        }
    }

    function handleChange(event) {
        // why slice(-1)? if there was already a number in the cell (e.g.: 4) and you press e.g.: 6 -> then the value would be "46".
        // since you only want to use the last number (6) you only take 6 into account
        const value = event.target.value.slice(-1)
        const {rowidx, colidx} = event.target.attributes;

        if (fillOrPen) {
            if (!isNaN(value) && value != "0") {
                setgrid((oldGrid)=> {
                    let newGrid = structuredClone(oldGrid);
                    newGrid[rowidx.value][colidx.value] = value;
                    return newGrid;
                })
            } 
        } else if (!fillOrPen) {
            if (!isNaN(value) && value != "0") {
                setpossibilitiesGrid((oldGrid)=> {
                    let newGrid = structuredClone(oldGrid);
                    newGrid[rowidx.value][colidx.value][value] = !newGrid[rowidx.value][colidx.value][value];
                    return newGrid;
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

        // if fast mode is active
        if (fastOrSlowMode) {
            // if fast mode is active && fill-mode is active
            if (fillOrPen) {
                setgrid((oldGrid)=>{
                    const newGrid = structuredClone(oldGrid);
                    newGrid[Number(rowidx.value)][Number(colidx.value)] = activeNumber;
                    return newGrid;
                })
            // if fast mode is active && pen-mode is active
            } else if (!fillOrPen) {
                setpossibilitiesGrid((oldGrid)=>{
                    const newGrid = structuredClone(oldGrid);
                    newGrid[Number(rowidx.value)][Number(colidx.value)][activeNumber] = !newGrid[Number(rowidx.value)][Number(colidx.value)][activeNumber];
                    return newGrid;
                    
                })
            }
        } 
    }

    let displayedGrid = grid.map((row, rowidx) => {
        return (
            <div className="sodokuRow">
                {
                    row.map((cell, colidx) => {
                        return (
                            <input type="text"
                            name={rowidx.toString() + colidx.toString()}
                            value={grid[rowidx][colidx]}
                            className={"sudokuCell" }
                            rowidx={rowidx}
                            colidx={colidx}
                            onChange={handleChange}
                            onClick={handleClick}/>
                        )
                    })
                }
            </div>
        )
    })

    function handleClickNumberButton(e) {
        // only if you are in slow mode and you have focus on a cell inside the sudoku
        if (!fastOrSlowMode && activeCell != null) {
            // only if you are in fill mode
            if (fillOrPen) {
                setgrid((oldGrid)=> {
                    const num = Number(e.target.innerHTML);
                    const newGrid = structuredClone(oldGrid);
                    newGrid[activeCell[0]][activeCell[1]] = num;
                    return newGrid
                })
            } else if (!fillOrPen) {
                // only if you are in pencil mode
                setpossibilitiesGrid((oldGrid)=>{
                    const num = Number(e.target.innerHTML);
                    const newGrid = structuredClone(oldGrid);
                    newGrid[activeCell[0]][activeCell[1]][num] = !newGrid[activeCell[0]][activeCell[1]][num];
                    return newGrid
                })
            }
        }
    }

    console.log('complete history is: ', valueHistory, possibilitiesHistory);

    return(
        <div className="sodokuGrid">
            <div>Difficulty: {props.difficulty}</div>
            <button onClick={props.handleClickChooseDifficulty}>Play a different Sudoku? </button>
            <button onClick={props.handleClickAnalyze}>See history </button>
            <button onClick={toggleFillOrPen}>{fillOrPen ? 'Change to Pen-Mode': 'Change to Fill-Mode'}</button>
            <button onClick={toggleFastOrSlowMode}>{fastOrSlowMode ? 'Change to Slow-Mode': 'Change to Fast-Mode'}</button>
            <button onClick={jumpBackInTime}>Return to previous state</button>
            <button onClick={(e)=>{setactiveNumber(0); handleClickNumberButton(e)}}>0</button>
            <button onClick={(e)=>{setactiveNumber(1); handleClickNumberButton(e)}}>1</button>
            <button onClick={(e)=>{setactiveNumber(2); handleClickNumberButton(e)}}>2</button>
            <button onClick={(e)=>{setactiveNumber(3); handleClickNumberButton(e)}}>3</button>
            <button onClick={(e)=>{setactiveNumber(4); handleClickNumberButton(e)}}>4</button>
            <button onClick={(e)=>{setactiveNumber(5); handleClickNumberButton(e)}}>5</button>
            <button onClick={(e)=>{setactiveNumber(6); handleClickNumberButton(e)}}>6</button>
            <button onClick={(e)=>{setactiveNumber(7); handleClickNumberButton(e)}}>7</button>
            <button onClick={(e)=>{setactiveNumber(8); handleClickNumberButton(e)}}>8</button>
            <button onClick={(e)=>{setactiveNumber(9); handleClickNumberButton(e)}}>9</button>
            {displayedGrid}
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