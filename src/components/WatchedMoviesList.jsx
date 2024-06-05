import WatchedMovie from "./WatchedMovies";
import { useState, useEffect } from "react";
function WatchedMoviesList({ onDelete, selectListId, onCloseMovie }) {
  const [done, setDone] = useState(false);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (selectListId != null) {
        try {
          const response = await fetch(
            `https://fasal-backend.vercel.app/movielists/${selectListId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          // console.log("data");
          // console.log(data);
          setWatched(data);
          setDone(true);
        } catch (error) {
          console.error("Failed to fetch playlists:", error);
        }
      }
    };

    fetchPlaylists();
  }, [selectListId]);

  return (
    <ul className="list">
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      {done &&
        watched.map((movie) => (
          <WatchedMovie key={movie._id} movie={movie} onDelete={onDelete} />
        ))}
    </ul>
  );
}

export default WatchedMoviesList;
