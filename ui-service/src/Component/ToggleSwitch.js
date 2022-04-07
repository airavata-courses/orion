import React, { useEffect } from "react";
import '../styles/ToggleSwitchCss.scss'

export const ToggleSwitch = ({ format, setFormat }) => {
    
    useEffect(() => {
        if(document.getElementById("source").innerHTML === "NEXRAD") {
			document.getElementById("source").innerHTML = "MERRA";
		} else {
			document.getElementById("source").innerHTML = "NEXRAD";
		}
    }, [ format ])

    return (
        <div className='ToggleSwitch ToggleSwitch__rounded'>
            <div className='ToggleSwitch__wrapper'>
                
                <div className={`Slider ${format && 'isChecked'}`} onClick={() => setFormat(!format)}>
                    <div className={`ToggleSwitch__text ${format && 'isMoved'}`} id="source">NEXRAD</div>
                </div>
                
            </div>
        </div>
    );
}
