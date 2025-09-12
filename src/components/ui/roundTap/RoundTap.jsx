import { useState } from 'react';
import './style.scss';
import { useTourClassStore } from '../../../store';

const RoundTap = ({text1='', text2='', bgColor, onClick = () => {}}) => {
    const {category, setCategory } = useTourClassStore();
    const [active, setActive] = useState(0);
    const style = {
        backgroundColor: bgColor,
      };
    // const handleClick = (index) =>{
    //     setActive(index);
    //     onClick(index);
    // }
    return (
        <ul className='roundTap' style={style}>
            <li style={{left:category==='tour'?'0':'50%'}}></li>
            <li onClick={()=>setCategory('tour')}><span>{text1}</span></li>
            <li onClick={()=>setCategory('class')}><span>{text2}</span></li>
        </ul>
    );
};

export default RoundTap;