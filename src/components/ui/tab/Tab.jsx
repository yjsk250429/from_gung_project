import './style.scss';

const Tab = ({ items = [], onClick = () => {} }) => {
  return (
    <ul className="tabs">
      {items.map((text, index) => (
        <li key={index} onClick={() => onClick(index)}>
          {text}
        </li>
      ))}
    </ul>
  );
};

export default Tab;