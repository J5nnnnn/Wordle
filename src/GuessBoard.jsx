import { React, useContext, useState, useEffect, useRef } from 'react';
import './game.css';
import { gameContext } from './GameProvider';
import './modal.css';

export default function GuessBoard(props) {
  const context = useContext(gameContext);

  let dispatch = context.dispatch;
  let game_state = context.game_state;
  

  let answer = game_state.word;

  let row = game_state.chance;
  let col = game_state.letter_guess;
  let guessed_list = game_state.guessed_list;
  let guess = game_state.temp_guess;
  let row_style, board_style;

  if(game_state.isHard){
    row_style = "guess_row_hard";
    board_style = "guess_board_hard";
  }else{
    row_style = "guess_row_normal";
    board_style = "guess_board_normal";
  }

  function check_correct(ans, gus){
    let res = [];
    const map = new Map();

    for(let i = 0; i < col; i++){
      map.set(ans[i], map.has(ans[i]) ? map.get(ans[i]) + 1 : 1);
      if(ans[i].toLowerCase() === gus[i].toLowerCase()){
        res[i] = "guess right";
        map.set(ans[i], map.get(ans[i]) - 1);
      }
    }

    for(let i = 0; i < col; i++){
      if(res[i] === undefined){
        if(map.has(gus[i]) && map.get(gus[i]) !== 0){
          res[i] = 'guess well';
        }else{
          res[i] = 'guess wrong';
        }
      }
    }
    return res;
  }

  function create_guessboard(){
    const guessboard = [];
    let padding = true;
    for(let i = 0; i < row; i++){
        const guess_row = [];

        let res = [];
        if(guessed_list[i]){
          res = check_correct(answer, guessed_list[i]);
        }

        for(let j = 0; j < col; j++){
            if(guessed_list[i]){
                let letter = guessed_list[i][j];                
                guess_row.push(<div className={res[j]}>{letter}</div>);
            }else if(guess[j] && padding){
                guess_row.push(<div className='guess'>{guess[j]}</div>);
                if(j === col - 1){
                    padding = false;
                }
            }else{
                padding = false;
                guess_row.push(<div className='guess'></div>);
            }

        }
        guessboard.push(<div className={row_style}>{guess_row}</div>);
    }
    return guessboard;
  }

  return(
    <div className='guess_board_container'>
        <div className={board_style}>
            {create_guessboard()}
        </div>
    </div>

  );
}