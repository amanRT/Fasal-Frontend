import { useState, useEffect } from "react";
function WatchedMovie({ movie, onDelete }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://fasal-backend.vercel.app/moviedata/${movie.movie}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };

    fetchData();
  }, [movie.movie]);

  return (
    data && (
      <li>
        <img src={data.Poster} alt={`${data.Title} poster`} />
        <h3>{data.Title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{data.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{data.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{data.Runtime}</span>
          </p>
          <button className="btn-delete" onClick={() => onDelete(data.imdbID)}>
            X
          </button>
        </div>
      </li>
    )
  );
}

export default WatchedMovie;
