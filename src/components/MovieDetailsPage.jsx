import { useState, useEffect } from "react";
const MovieDetailsPage = ({ mo, handelBack }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(mo);
        const fetchedMovies = await Promise.all(
          mo.map(async (movie) => {
            const response = await fetch(
              `https://fasal-backend.vercel.app/moviedata/${movie.movie}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
        );

        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };

    fetchData();
  }, [mo]);

  return (
    <div className="movie-details-page">
      <button className="btn-back" onClick={handelBack}>
        &larr;
      </button>
      <header className="header">
        <h1>Movie List</h1>
      </header>
      <div className="movies-container">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="movie-poster"
            />
            <div className="movie-info">
              <h2>{movie.Title}</h2>
              <p>Rating: {movie.imdbRating}</p>
              <p>Duration: {movie.Runtime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
