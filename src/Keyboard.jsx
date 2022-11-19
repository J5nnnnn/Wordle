import { React, useContext, useState } from 'react';
import './game.css';
import { gameContext } from './GameProvider';
import './modal.css';
import { useNavigate } from "react-router-dom";

export default function Keyboard(props){
    const context = useContext(gameContext);
    const navigate = useNavigate();

    let dispatch = context.dispatch;
    let game_state = context.game_state;
    let ACTION = context.ACTION;
    let guess = game_state.temp_guess;
    let guessed_list = game_state.guessed_list;
    let length = game_state.letter_guess;
    let answer = game_state.word;
    let chance = game_state.chance;
    let LIST = [];
    context.LIST.forEach(itm => {
        LIST.push(itm.toLowerCase());
    });
 
    const [enter_modal, setModal_enter] = useState(false);
    const [noword_modal, setModal_noword] = useState(false);
    const [win_modal, setModal_win] = useState(false);
    const [lost_modal, setModal_lost] = useState(false);

    function onClick_unable_enter() {
        setModal_enter(!enter_modal);
    }

    function onClick_no_word(){
        setModal_noword(!noword_modal);
    }

    // lost
    function onClick_lost(){
        setModal_lost(!lost_modal);
    }

    function onClick_lost_exit(){
        setModal_lost(!lost_modal);
        dispatch({type: ACTION.RESET});
        navigate('/');
        localStorage.removeItem("APP_LEFT_STATE");
    }

    function onClick_lost_again(){
        setModal_lost(!lost_modal);
        dispatch({type: ACTION.RESTART});
        localStorage.removeItem("APP_LEFT_STATE");
    }

    // win
    function onClick_win(){
        setModal_win(!win_modal);
    }
    
    function onClick_win_exit(){
        setModal_win(!win_modal);
        dispatch({type: ACTION.RESET});
        navigate('/');
        localStorage.removeItem("APP_LEFT_STATE");
    }

    function onClick_win_again(){
        setModal_win(!win_modal);
        dispatch({type: ACTION.RESTART});
        localStorage.removeItem("APP_LEFT_STATE");
    }

    function onClick_key(letter) {
        // debugger
        if(letter === 'del'){
            onClick_delete();
        }else if(letter === 'enter'){
            onClick_enter();
        }else{
            dispatch({ type: ACTION.APPEND, payload: letter });
        }
    }
    console.log("current guess", game_state.temp_guess);

    function onClick_enter() {
        if (guess.length < length) {
          setModal_enter(!enter_modal);
        } else {
          if (answer.toLowerCase() === guess.toLowerCase()) {
            dispatch({type: ACTION.ADD, payload: guess});
            setModal_win(!win_modal);
          } else {
            if(LIST.includes(guess)) {
                dispatch({type: ACTION.ADD, payload: guess});
                // you may change it or move it
                if(guessed_list.length === chance - 1){
                    setModal_lost(!lost_modal);
                }
            }else{
                setModal_noword(!noword_modal);
            }

          }
        }
    }
    
    function onClick_delete() {
        dispatch({ type: ACTION.DEL });
    }

    const keyboard = [["q","w","e","r","t","y","u","i","o","p"],
                      ['key_space','a','s','d','f','g','h','j','k','l','key_space'],
                      ['enter','z','x','c','v','b','n','m','del']];
    
    function create_keyboard(){
        const board = [];
        let i = 0;
        keyboard.forEach((row)=>{
            const row_list = [];
            row.forEach((keys)=>{
                let temp;
                if(keys === 'key_space'){
                    temp = (<div className= {keys} key={keys}> 
                            </div>);
                }else if(keys === 'enter'){
                    temp = (<button className='key' key={keys} id={keys} onClick={()=>{onClick_key(keys)}}>
                            {'enter'}
                            </button>);
                }else if(keys === 'del'){
                    temp = (<button className='key' key={keys} onClick={()=>{onClick_key(keys)}}>
                            {'←'}
                            </button>);
                }else{
                    temp = (<button className='key' key={keys} onClick={()=>{onClick_key(keys)}}>
                        {keys}
                        </button>);
                }
                row_list.push(temp);
            })
            board.push(<div className='key_board' key={i++}>{row_list}</div>)
        });
        return board;
    }


    return(
        <>
            {lost_modal && (
                <div className="modal">
                    <div className="overlay"></div>
                    <div className="modal-content">
                        <h2>You Lost!</h2>
                        <p><strong>Answer is {answer}</strong></p>
                        <button className="close-modal" onClick={onClick_lost}>
                            CLOSE
                        </button>
                        <button className="exit-modal" onClick={onClick_lost_exit}>
                            EXIT
                        </button>
                        <button className="again-modal" onClick={onClick_lost_again}>
                            TRY AGAIN!
                        </button>
                    </div>
                </div>
            )}

            {win_modal && (
                <div className="modal">
                    <div className="overlay"></div>
                    <div className="modal-content">
                        <h2>Congratulations! You Win!</h2>
                        <button className="close-modal" onClick={onClick_win}>
                            CLOSE
                        </button>
                        <button className="exit-modal" onClick={onClick_win_exit}>
                            EXIT
                        </button>
                        <button className="again-modal" onClick={onClick_win_again}>
                            ONE MORE GAME!
                        </button>
                    </div>
                </div>
            )}
            {enter_modal && (
                <div className="modal">
                    <div onClick={onClick_unable_enter} className="overlay"></div>
                    <div className="modal-no-btn">
                        <h2>Not Enough Letters!</h2>
                        <button className="close-modal" onClick={onClick_unable_enter}>
                        CLOSE
                        </button>
                    </div>
                </div>
            )}

            {noword_modal && (
                <div className="modal">
                <div onClick={onClick_no_word} className="overlay"></div>
                <div className="modal-no-btn ">
                    <h2>No Word in the List</h2>
                    <button className="close-modal" onClick={onClick_no_word}>
                    CLOSE
                    </button>
                </div>
                </div>
            )}

            <div className='type_board'>
                {
                    create_keyboard()
                }
            </div>
        </>
    );
}