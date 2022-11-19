import {React, useContext} from "react";
import example_normal from "./rules.png";
import './Welcome.css';
import { useNavigate } from "react-router-dom";
import {gameContext} from "./GameProvider";
import example_hard from "./rule_hard.png";


export default function Rule(props){
    const navigate = useNavigate();
    const context = useContext(gameContext);

    let game_state = context.game_state;
    let rule_pic, letter_in, letter_on, letter_off;

    if(game_state.isHard){
        rule_pic = example_hard;
        letter_on = "V, I, L"
    }else{
        rule_pic = example_normal;
    }

    function goback(){
        navigate(-1);
    }


    return(
        <>        
            <header className="navbar">
                <button className="button_welcome" onClick={goback}> Back </button>
            </header>
            <div className="rule_layout">

                <h1>How to Play</h1>
                <div>Guess the Wordle in {game_state.chance} tries</div>
                <li>Each guess must be a valid {game_state.letter_guess}-letter word.</li>
                <li>The color of the tiles will change to show how close your guess was
                    to the word.
                </li>
                <h3>Examples</h3>
                <img src={rule_pic} alt="rule_example" className="rule_eg" />
                <li> <span style={{color: '#13a653', fontWeight:'bold'}}>GREEN</span> means letter guessed is in the word and correct spot.</li>
                <li><span style={{color: '#c6ad23', fontWeight:'bold'}}>YELLOW</span> means letter guessed is in the word but wrong spot.</li>
                <li><span style={{color: '#070807', fontWeight:'bold'}}>BLACK</span> means letter guessed is not in the word in any spot.</li> 
            </div>
        </>

    )
}