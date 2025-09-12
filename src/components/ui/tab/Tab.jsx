import { useState } from 'react';
import './style.scss';

const Tab = ({ items = [], onClick = () => {}, textColor, borderColor, height }) => {
    const [activeTab, setActiveTab] = useState(0);
    const handleclick = (index) =>{
        setActiveTab(index);
        onClick(index);
    };


  return (
    <ul className="tabs">
      {items.map((text, index) => (
        <li key={index} onClick={() => handleclick(index)} className={activeTab===index? 'on':''}>
          {text}
        </li>
      ))}
    </ul>
  );
};

export default Tab;