import { useState } from 'react';
import './style.scss';

const Tab = ({ items = [], onClick = () => {}, textColor, borderColor}) => {
    const [activeTab, setActiveTab] = useState(0);
    const handleclick = (index) =>{
        setActiveTab(index);
        onClick(index);
    };
    const style ={
      borderColor:borderColor,
      fontColor:textColor,
    }

  return (
    <ul className="tabs" style={style}>
      {items.map((text, index) => (
        <li key={index} onClick={() => handleclick(index)} className={activeTab===index? 'on':''}>
          {text}
        </li>
      ))}
    </ul>
  );
};

export default Tab;