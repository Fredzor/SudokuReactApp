import React from 'react'

export default function SudokuContainer(props) {
    console.log(props.sudoku)

    function convertNumToTimeFormat(num) {
        let mins = Math.floor(num/60)
        let secs = num % 60
        return `${mins < 10? 0:''}${mins}:${secs < 10? 0:''}${secs}`
    }
    let timePlayedDisplayed = convertNumToTimeFormat(props.sudoku.timePlayed)

    return (
        <div className="sudokuInfo" key={props.sudoku.id}>
            <div className="sudokuMetaData">
                <li>
                    <ul>ID: #{props.sudoku.id}</ul>
                    <ul>Time needed: {timePlayedDisplayed}</ul>
                    <ul>Date finished: {props.sudoku.dateFinished}</ul>
                </li>
            </div>
            <div className="sudokuPicture"></div>
        </div>
    )


}