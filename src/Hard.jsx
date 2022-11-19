import { React, useContext, useState } from 'react';
import './game.css';
import { useNavigate } from 'react-router-dom';
import { gameContext } from './GameProvider';
import './modal.css';
import Keyboard from './Keyboard';
import GuessBoard from './GuessBoard';
import { useEffect } from 'react';


export default function Hard(props) {
    const navigate = useNavigate();
    const context = useContext(gameContext);
  
    let dispatch = context.dispatch;
    let game_state = context.game_state;
    let ACTION = context.ACTION;



    // useEffect logic order:
        // navigate function, to leave the page
        // render all the component from outside thru
        // landing to welcome page
        // unmounting! (useEffect!)
    function goback() {
        setModal_back(!modal_back);
        dispatch({type: ACTION.RESET})
        navigate('/');
        localStorage.removeItem("APP_LEFT_STATE");
    }

    function back_save(){
        setModal_back(!modal_back);
        navigate('/');
        localStorage.removeItem("APP_LEFT_STATE");
    }

    function onClick_rule() {
        navigate('/rules');
    }

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

    useEffect(()=>{
        const DATA = window.localStorage.getItem('APP_LEFT_STATE');
        console.log(game_state);
        if(DATA !== null){
            let tmp = JSON.parse(DATA);
            if(tmp.guessed_list.length === 0 && tmp.temp_guess === ""){
            //   localStorage.removeItem("APP_LEFT_STATE")
                if(tmp.isHard && tmp.isHard !== game_state.isHard){
                    dispatch({type:ACTION.LEVEL});
                }
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


    return (
        <>
        <header className="navbar"> 
            <button className='button' onClick={onClick_back}> Back </button>
            <div className='longer'>
                <button className='button' onClick={onClick_rule}> Rule </button>
            </div>
            <div className="mode_title">Hard mode:</div>
                <label className="switch">
                    <input type="checkbox" onClick={onClick_unable_change} 
                        checked={game_state.isHard} readOnly></input>
                    <span className="slider round"></span>
                </label>
        </header>
        {modal && (
                <div className="modal">
                <div onClick={onClick_unable_change} className="overlay"></div>
                <div className="modal-content">
                    <h2>Hello Wordler!</h2>
                    <p>
                        You can only change the level before game start!
                    </p>
                    <button className="close-modal" onClick={onClick_unable_change}>
                    CLOSE
                    </button>
                </div>
                </div>
            )}

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


        <div className='game_layout_hard'>
            <GuessBoard />
            <Keyboard />
        </div>
        </>
    );
}
