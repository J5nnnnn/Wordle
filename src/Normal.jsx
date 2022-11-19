import { React, useContext, useState, useEffect } from 'react';
import './game.css';
import { useNavigate } from 'react-router-dom';
import { gameContext } from './GameProvider';
import './modal.css';
import Keyboard from './Keyboard';
import GuessBoard from './GuessBoard';


export default function Normal(props) {
  const navigate = useNavigate();
  const context = useContext(gameContext);

  let dispatch = context.dispatch;
  let game_state = context.game_state;
  let ACTION = context.ACTION;


  useEffect(()=>{
      const DATA = window.localStorage.getItem('APP_LEFT_STATE');
      
      if(DATA !== null){
        let tmp = JSON.parse(DATA);
        if(tmp.guessed_list.length === 0 && tmp.temp_guess === ""){
          localStorage.removeItem("APP_LEFT_STATE")
        }else{
          setModal_resume(!modal_resume);
        }
      }
  },[])


  window.onbeforeunload = ()=>{
    // if leave or refresh save state;
    // normal leave should not save state;
    // after load the state, delete it!
    window.localStorage.setItem("APP_LEFT_STATE", JSON.stringify(game_state));
  }

  function goback() {
    setModal_back(!modal_back);
    dispatch({type: ACTION.RESET})
    localStorage.removeItem("APP_LEFT_STATE")
    navigate('/');
  }

  function back_save(){
    setModal_back(!modal_back);
    localStorage.removeItem("APP_LEFT_STATE")
    navigate('/');
  }

  function onClick_rule() {
    navigate('/rules');
  }

//   useEffect(() => {
//     const keys = document.querySelectorAll('.key:not(.delete,.enter)');
//     // keys.forEach((key) => {
//     //   key.addEventListener('click', onClick_key);
//     // });
//     const enter = document.querySelector('.enter');
//     enter.addEventListener('click', onClick_enter);
//     const del = document.querySelector('.delete');
//     del.addEventListener('click', onClick_delete);

//     console.log('key are attached!');
//     return () => {
//       keys.forEach((key) => {
//         key.removeEventListener('click', onClick_key);
//       });
//       enter.removeEventListener('click', onClick_enter);
//       del.removeEventListener('click', onClick_delete);
//       console.log('unmounts!!');
//     };
//   }, [guess]); 

// //   useEffect(() => {
// //     console.log("guess changed!")
// //   },[guess]);

//   useEffect(() => {
//     let space = document.querySelector('.guess_row_normal:not(.used)');
//     space.classList.add('using');
//     console.log('next row is fetched');
//   }, [guessed_list]);


  const [modal, setModal] = useState(false);
  const [modal_back, setModal_back] = useState(false);
  const [modal_resume, setModal_resume] = useState(false);

  function onClick_resueme(){
    setModal_resume(!modal_resume);
    const tmp = JSON.parse(window.localStorage.getItem('APP_LEFT_STATE'));
    localStorage.removeItem('APP_LEFT_STATE');
    let path = (tmp.isHard) ? "/game/hard" : "/game/normal";
    dispatch({type: ACTION.RESUME, payload: tmp});
    navigate(path);
  }

  function onClick_resueme_close(){
    setModal_resume(!modal_resume);
    // let path = (game_state.isHard) ? "/game/hard" : "/game/normal";
    // navigate(path);
  }

    
  function onClick_unable_change() {
    setModal(!modal);
  }

  function onClick_back(){
    setModal_back(!modal_back);
  }

  return (
    <>
      <header className="navbar">
        <button className="button" onClick={onClick_back}>
          Back
        </button>
        <div className="longer">
          <button className="button" onClick={onClick_rule}>
            Rule
          </button>
        </div>
        <div className="mode_title">Hard mode:</div>
        <label className="switch">
          <input
            type="checkbox"
            onClick={onClick_unable_change}
            checked={game_state.isHard}
            readOnly
          ></input>
          <span className="slider round"></span>
        </label>
      </header>

      {modal_back && (
        <div className="modal">
          <div onClick={onClick_back} className="overlay"></div>
          <div className="modal-content">
            <h3>Are you sure you want to leave?</h3>
            
            <button className="exit-modal" onClick={goback}>
              Yes
            </button>
            <button className="mid-modal" onClick={back_save}>
              leave, but save
            </button>
            <button className="again-modal" onClick={onClick_back}>
              Resume
            </button>
          </div>
        </div>
      )}

      {modal_resume && (
            <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                <h3>You have a lefte game, wish to Continue?</h3>
                <button className="exit-modal" onClick={onClick_resueme}>
                    Yes
                </button>
                <button className="again-modal" onClick={onClick_resueme_close}>
                    No
                </button>
                </div>
            </div>
          )}
      

      {modal && (
        <div className="modal">
          <div onClick={onClick_unable_change} className="overlay"></div>
          <div className="modal-content">
            <h2>Hello Wordler!</h2>
            <p>You can only change the level before game start!</p>
            <button className="close-modal" onClick={onClick_unable_change}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      <div className="game_layout">
        <GuessBoard />
        <Keyboard />
      </div>
    </>
  );
}
