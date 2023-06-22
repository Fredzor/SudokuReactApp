import logo from '../logo.svg';
import '../App.css';
import ChoosePlayOrAnalyze from './ChoosePlayOrAnalyze';
import ChooseDifficulty from './ChooseDifficulty';
import PlaySudoku from './PlaySudoku';
import AnalyzeHistory from './AnalyzeHistory';
import ChooseNewOrActive from './ChooseNewOrActive'

import SudokuGrid from './PlaySudoku';
import React from 'react';

function App() {
  // options: ChoosePlayOrAnalyze, AnalyzeHistory, ChooseDifficulty, ChooseNewOrActive, PlaySudoku
  const [programState, setProgramState] = React.useState('ChoosePlayOrAnalyze')
  // options: Easy, Medium, Hard
  const [difficulty, setDifficulty] = React.useState('Medium')
  // gets set in 'ChoosePlayOrAnalyze' to the client-ip-adress
  const [playerID, setplayerID] = React.useState(0);
  // 
  const [playedSudoku, setplayedSudoku] = React.useState(null)

  const [authCookie, setauthCookie] = React.useState(getCookie('csrftoken'))

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  

  function handleClickAnalyze() {
    setProgramState('AnalyzeHistory')
  }

  function handleClickChoosePlayOrAnalyze() {
    setProgramState('ChoosePlayOrAnalyze')
  }

  function handleClickChooseDifficulty() {
    setProgramState('ChooseDifficulty')
  }

  function handleClickPlaySudoku() {
    setProgramState('PlaySudoku')
  }

  return (
    <div className="App">
      {programState === 'ChoosePlayOrAnalyze' && <ChoosePlayOrAnalyze
      handleClickAnalyze = {handleClickAnalyze}
      handleClickChooseDifficulty = {handleClickChooseDifficulty}
      setplayerID = {setplayerID}
      authCookie = {authCookie}
      />}
      {programState === 'ChooseDifficulty' && <ChooseDifficulty
      setProgramState = {setProgramState}
      setDifficulty = {setDifficulty}
      authCookie = {authCookie}

      />}
      {programState === 'PlaySudoku' && <PlaySudoku
      difficulty = {difficulty}
      handleClickChooseDifficulty = {handleClickChooseDifficulty}
      handleClickAnalyze = {handleClickAnalyze}
      playerID = {playerID}
      authCookie = {authCookie}
      setplayedSudoku = {setplayedSudoku}
      playedSudoku = {playedSudoku}
      />}

      {programState === 'ChooseNewOrActive' && <ChooseNewOrActive
      difficulty = {difficulty}
      playerID = {playerID}
      authCookie = {authCookie}
      handleClickPlaySudoku = {handleClickPlaySudoku}
      setplayedSudoku = {setplayedSudoku}
      />}

      {programState === 'AnalyzeHistory' && <AnalyzeHistory
      authCookie = {authCookie}
      playerID = {playerID}
      
      />}
    </div>
  );
}

export default App;
