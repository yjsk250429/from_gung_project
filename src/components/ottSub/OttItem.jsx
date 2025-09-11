import './style.scss';

const OttItem = ({poster_path, name}) => {
    return (
        <li >
        {poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w200${poster_path}`}
            alt={name}
          />
        )}
      </li>
    );
};

export default OttItem;