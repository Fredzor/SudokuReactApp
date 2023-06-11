import React from 'react'


export default function ChooseDifficulty(props) {


    return (
        <div className='settingsContainer'>
            <h1>Choose Difficulty</h1>
            <button onClick = {()=>{
                props.setProgramState('ChooseNewOrActive');
                props.setDifficulty('Easy');
                }}>Easy
            </button>
            <button onClick = {()=>{
                props.setProgramState('ChooseNewOrActive');
                props.setDifficulty('Medium');
                }}>Medium
            </button>
            <button onClick = {()=>{
                props.setProgramState('ChooseNewOrActive');
                props.setDifficulty('Hard');
                }}>Hard
            </button>
            <button onClick = {()=>{
                props.setProgramState('ChoosePlayOrAnalyze');
                props.setDifficulty('Hard');
                }}>Return
            </button>
        </div>
    )

}