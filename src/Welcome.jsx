import React from 'react';
import wordle from './wordle.png';
import './Welcome.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { gameContext } from './GameProvider';

export default function Welcome(props) {
  const navigate = useNavigate();
  const context = useContext(gameContext);

  let dispatch = context.dispatch;
  let game_state = context.game_state;
  let ACTION = context.ACTION;
  const [modal, setModal] = useState(false);
  const [modal_erase, setModal_erase] = useState(false);
  const [anima, setAnima] = useState(false);

  function title_anima() {
    setAnima(true);
    setTimeout(() => setAnima(false), 750);
  }

  function onClick_modal_erase() {
    setModal_erase(!modal_erase);
  }

  function onClick_erase() {
    dispatch({ type: ACTION.LEVEL });
    setModal_erase(!modal_erase);
  }

  function onClick_modal() {
    setModal(!modal);
  }

  function onClick_resume() {
    setModal(!modal);
    navigate(game_path);
  }

  function onClick_new_game() {
    setModal(!modal);
    dispatch({ type: ACTION.RESTART });
    navigate(game_path);
  }

  function onClick_rule() {
    navigate('/rules');
  }

  let game_path, layout, title, anima_title;

  if (game_state.isHard === false) {
    game_path = '/game/normal';
    layout = 'layout';
    title = 'title';
    anima_title = 'title change';
  } else {
    game_path = '/game/hard';
    layout = 'layout_hard';
    title = 'title_hard';
    anima_title = 'title_hard change';
  }

  window.onbeforeunload = () => {
    // if leave or refresh save state;
    // normal leave should not save state;
    // after load the state, delete it!
    window.localStorage.setItem('APP_LEFT_STATE', JSON.stringify(game_state));
  };

  function onClick_game() {
    if (game_state.temp_guess === '' && game_state.guessed_list.length === 0) {
      navigate(game_path);
    } else {
      setModal(!modal);
    }
  }

  function onChange_level() {
    if (game_state.temp_guess === '' && game_state.guessed_list.length === 0) {
      dispatch({ type: ACTION.LEVEL });
      title_anima();
    } else {
      onClick_modal_erase();
    }
  }

  return (
    <div className={layout}>
      {modal && (
        <div className="modal">
          <div className="overlay" onClick={onClick_modal}></div>
          <div className="modal-content">
            <h2>Resume Left Game?</h2>
            <button className="close-modal" onClick={onClick_modal}>
              CLOSE
            </button>
            <button className="exit-modal" onClick={onClick_resume}>
              YSE!
            </button>
            <button className="again-modal" onClick={onClick_new_game}>
              NEW GAME!
            </button>
          </div>
        </div>
      )}

      {modal_erase && (
        <div className="modal">
          <div className="overlay" onClick={onClick_modal_erase}></div>
          <div className="modal-content">
            <h2>Saved Data Will Lose </h2>
            <button className="close-modal" onClick={onClick_modal_erase}>
              CLOSE
            </button>
            <button className="exit-modal" onClick={onClick_erase}>
              Erase it!
            </button>
            <button className="again-modal" onClick={onClick_modal_erase}>
              Keep it!
            </button>
          </div>
        </div>
      )}

      <div className="top_bar">
        <div className="mode_title">Hard mode:</div>
        <label className="switch">
          <input
            type="checkbox"
            onChange={onChange_level}
            checked={game_state.isHard}
          ></input>
          <span className="slider round"></span>
        </label>
      </div>
      <div className={anima ? anima_title : title}>Wordle Game </div>
      <img src={wordle} alt="Logo" className="logo" />
      <div className="subtitle">
        Get {game_state.chance} chances to guess a {game_state.letter_guess}
        -letter word.
      </div>
      <button className="button_welcome" onClick={onClick_game}>
        Play
      </button>
      <button className="button_welcome" onClick={onClick_rule}>
        Rule
      </button>
    </div>
  );
}
