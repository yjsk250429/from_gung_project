import { useState } from 'react';
import './style.scss';
import { useTourClassStore } from '../../../store';

const RoundTap = ({text1='', text2='', bgColor, onClick = () => {}}) => {
    const {setTour, setClass} = useTourClassStore();
    const [active, setActive] = useState(0);
    const style = {
        backgroundColor: bgColor,
      };
    const handleClick = (index) =>{
        setActive(index);
        onClick(index);
    }
    return (
        <ul className='roundTap' style={style}>
            <li style={{left:active===0?'0':'50%'}}></li>
            <li onClick={()=>{handleClick(0);setTour();}}><span>{text1}</span></li>
            <li onClick={()=>{handleClick(1);setClass();}}><span>{text2}</span></li>
        </ul>
    );
};

export default RoundTap;