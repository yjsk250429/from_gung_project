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
            <li className={active === 0 ? 'on':''} onClick={()=>{handleClick(0);setTour}}>{text1}</li>
            <li className={active === 1 ? 'on':''} onClick={()=>{handleClick(1);setClass}}>{text2}</li>
        </ul>
    );
};

export default RoundTap;