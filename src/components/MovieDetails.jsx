import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import PlayListForm from "./PlayListForm";
function MovieDetails({
  selectId,
  onCloseMovie,
  onAddWatched,
  watched,
  userDetails,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userPlyList, setUserPlyList] = useState(false);
  const countRef = useRef(0);
  const [showPopup, setShowPopup] = useState(false);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);
  console.log();
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newMovie = {
      imdbID: selectId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      countRatingDecisions: countRef.current,
    };
    setShowPopup(true);
    // onAddWatched(newMovie);
    // onCloseMovie();
    // setUserPlyList(true);
  }

  useEffect(() => {
    async function getMovie() {
      setIsLoading(true);
      const res = await fetch(
        `https://fasal-backend.vercel.app/moviedata/${selectId}`
      );
      const data = await res.json();
      setMovie(data);
      console.log(data);
      setIsLoading(false);
    }
    getMovie();
  }, [selectId]);

  useEffect(() => {
    if (!title) return;
    document.title = `MOVIE | ${title}`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <button className="btn-add" onClick={handleAdd}>
                +Add to list
              </button>
            </div>
            {showPopup && (
              <PlayListForm
                setShowPopup={setShowPopup}
                userDetails={userDetails}
                movieId={selectId}
              />
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
export default MovieDetails;
