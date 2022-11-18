import React from 'react';
import { useReducer } from 'react';
import { createContext } from 'react';
import test from "./WordList.txt";

export const gameContext = createContext();

export function GameProvider(props) {
  const ACTION = {
    LEVEL: 'level',
    APPEND: 'append',
    DEL: 'delete',
    ADD: 'add',
    RESET: 'reset',
    RESTART: 'restart',
    RESUME: 'resume',
    HARD: 'hard',
  };

  const WORD_LIST = [
    'abcdef',
    'abroad',
    'answer',
    'Choose',
    'Attend',
    'Chance',
    'August',
    'Advice',
    'Almost',
    'Answer',
    'Behind',
    'Desert',
    'Appeal',
  ];

  const WORD_LIST_HARD = ['Visible', 'Vehicle'];

  const reader = new FileReader();

//   fetch('WordList.txt').then(r=> r.text()).then(text => console.log(text))

  console.log(fetch(test));

  function game_state_reducer(state, action) {
    switch (action.type) {
      case 'level':
        return {
          ...initialState,
          isHard: !state.isHard,
          chance: state.isHard ? 6 : 5,
          letter_guess: state.isHard ? 6 : 7,
          word: state.isHard
            ? WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
            : WORD_LIST_HARD[Math.floor(Math.random() * WORD_LIST_HARD.length)],
        };
      case 'append':
        console.log(state.temp_guess);
        return {
          ...state,
          temp_guess:
            state.curr_index === state.letter_guess
              ? state.temp_guess
              : state.temp_guess.concat(action.payload),
          curr_index:
            state.curr_index === state.letter_guess
              ? state.curr_index
              : state.curr_index + 1,
        };
      case 'delete':
        return {
          ...state,
          temp_guess: state.temp_guess.slice(0, -1),
          curr_index: state.curr_index === 0 ? 0 : state.curr_index - 1,
        };
      case 'add':
        console.log('before push', state.guessed_list);
        let tmp = state.guessed_list;
        tmp.push(action.payload);
        console.log('after push', state.guessed_list);
        return { ...state, guessed_list: tmp, curr_index: 0, temp_guess: '' };
      case 'reset':
        // will unmounting
        return { ...initialState };
      case 'restart':
        // no unmounting
        return {
          ...initialState,
          isHard: state.isHard,
          chance: state.chance,
          letter_guess: state.letter_guess,
          word: state.isHard
            ? WORD_LIST_HARD[Math.floor(Math.random() * WORD_LIST_HARD.length)]
            : WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)],
        };
      case 'resume':
        return {
          ...action.payload,
        };
      case 'hard':
        return {};
      default:
        return state;
    }
  }

  const initialState = {
    isHard: false,
    chance: 6,
    letter_guess: 6,
    temp_guess: '',
    guessed_list: [],
    word: WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)],
    curr_index: 0,
  };

  const [game_state, dispatch] = useReducer(game_state_reducer, initialState);

  const LIST = game_state.isHard ? WORD_LIST_HARD : WORD_LIST;

  console.log(game_state.word);
  return (
    <gameContext.Provider value={{ game_state, dispatch, ACTION, LIST }}>
      {props.children}
    </gameContext.Provider>
  );
}
