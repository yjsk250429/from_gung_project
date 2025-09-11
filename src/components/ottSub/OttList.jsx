import './style.scss';
import { useEffect } from "react";
import { useMovieStore } from "../../store";
import OttItem from './OttItem';

const OttList = () => {
    const { movies, fetchMovies, loading, error } = useMovieStore();

    useEffect(() => {
        fetchMovies({ category: "popular", page: 1 });
      }, [fetchMovies]);
    
      if (loading) return <p>로딩 중...</p>;
      if (error) return <p>에러 발생: {error}</p>;
    return (
        <ul className='ottlist'>
            {movies.map((movie) => (
              <OttItem key={movie.id} {...movie}/>
            ))}
        </ul>
    );
};

export default OttList;