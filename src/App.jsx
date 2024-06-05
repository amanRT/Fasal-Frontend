import React, { useState, useEffect, useRef } from "react";
import { useLocalStorageState } from "./components/useLocalStorageState";
import jwtDecode from "jwt-decode";
import StarRating from "./components/StarRating";
import { useMovies } from "./components/useMovie";
import { useKey } from "./components/useKey";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import {
  Container,
  Form,
  Input,
  Button,
  Title,
  LinkText,
} from "./components/StyledComponents";

const KEY = "7ee71635";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
const PublicPlaylistsPage = () => {
  const { id } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [playSelect, setPlaySelect] = useState(true);
  const [playlistid, setPlaylistid] = useState(null);
  const [watched, setWatched] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const backButton = () => {
    navigate(`/`);
  };

  async function loadProfile() {
    try {
      const response = await fetch(
        `https://fasal-backend.vercel.app/getspecificuser/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(
          `https://fasal-backend.vercel.app/playlists/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const publicPlaylists = data.filter((playlist) => playlist.isPublic);
        setPlaylists(publicPlaylists);
        await loadProfile(); // Awaiting loadProfile to ensure profile is set
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [id]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (playlistid != null) {
        try {
          const response = await fetch(
            `https://fasal-backend.vercel.app/${playlistid}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setWatched(data);
          setPlaySelect(false);
        } catch (error) {
          console.error("Failed to fetch playlists:", error);
        }
      }
    };

    fetchPlaylists();
  }, [playlistid]);

  const handlePlaylistClick = (playlistId) => {
    setPlaylistid(playlistId);
  };

  const handelBack = () => {
    setPlaySelect(true);
  };

  // console.log(profile);

  return (
    <>
      {playSelect ? (
        <div className="public-playlists-page">
          <header className="header">
            <h1>
              Public Playlists of{" "}
              {profile && profile.fname + " " + profile.lname}
            </h1>
          </header>
          <button className="btn-back" onClick={backButton}>
            &larr;
          </button>
          <div className="playlists-container">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist._id)}
              >
                <div className="playlist-info">
                  <h2>{playlist.name}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MovieDetailsPage mo={watched} handelBack={handelBack} />
      )}
    </>
  );
};

const MovieDetailsPage = ({ mo, handelBack }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMovies = await Promise.all(
          mo.map(async (movie) => {
            const response = await fetch(
              `https://fasal-backend.vercel.app/moviedata/{movie.movie}`
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
  }, [mo, KEY]);

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

//     fetchData();
//   }, [movie.movie]);
export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/movies/:id" element={<PublicPlaylistsPage />} />
        </Routes>
      </Router>
    </>
  );
}
const Mainpage = () => {
  const [query, setQuery] = useState("");
  const [selectId, setSelectId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [isLogin, setIsLogin] = useState(!localStorage.getItem("token"));
  const [signType, setSign] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [selectListId, setSelectListId] = useState(null);
  const [plyName, setPlyName] = useState(null);
  const [render, setRender] = useState(false);
  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch(
        `https://fasal-backend.vercel.app/getspecificuser/${id}`
      );
      const userData = await response.json();
      setUserDetails(userData);
      setIsLogin(false);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };
  const fetchPlaylists = async () => {
    if (userDetails != null) {
      try {
        const response = await fetch(
          `https://fasal-backend.vercel.app/${userDetails._id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        setPlaylistDetails(data);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      fetchUserDetails(decoded.id);
    }
  }, []);
  useEffect(() => {
    fetchPlaylists();
  }, [userDetails]);

  function handleSelectMovie(id) {
    setSelectId((selectId) => (id === selectId ? null : id));
  }
  function handleSelectPlaylist(id) {
    setSelectListId((selectListId) => (id === selectListId ? null : id));
  }
  function handleCloseMovie() {
    setSelectId(null);
  }
  useEffect(() => {}, [selectListId]);
  function handleClosePly() {
    setSelectListId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  const handleDeleteWatched = async (id, setPlaylists, selectedPlaylistId) => {
    // console.log(id);
    try {
      const response = await fetch(
        `https://fasal-backend.vercel.app/playlist/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete playlist: ${response.status}`);
      }

      // console.log("Playlist deleted successfully!");

      // Update UI for immediate feedback (optional):
      // - You can display a temporary success message or visual cue.

      // Update playlists state using a callback function:
      // const updatedPlaylists = await setPlaylists((prevPlaylists) =>
      //   prevPlaylists.filter((playlist) => playlist._id !== id)
      // );

      // Update selected playlist state if necessary:
      if (selectedPlaylistId === id) {
        setRender(!render);
      }

      // Refetch playlists data (consider trade-offs based on data size):
      fetchPlaylists(); // Assuming you have this function to fetch playlists
    } catch (error) {
      console.error("Error deleting playlist:", error);
      // Handle the error appropriately (e.g., display an error message to the user)
    }
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    setIsLogin(true);
    setUserDetails(null);
  };
  useEffect(() => {
    console.log();
  }, [render]);
  return (
    <>
      {isLogin ? (
        <>
          {signType ? (
            <Login
              setIsLogin={setIsLogin}
              setSign={setSign}
              setUserDetails={setUserDetails}
              fetchUserDetails={fetchUserDetails}
            />
          ) : (
            <Signup
              setIsLogin={setIsLogin}
              setSign={setSign}
              setUserDetails={setUserDetails}
              fetchUserDetails={fetchUserDetails}
            />
          )}
        </>
      ) : (
        <>
          <NavBar onLogoutClick={handleLogoutClick} profileData={userDetails}>
            <Logo />
            <Search query={query} setQuery={setQuery} />
          </NavBar>

          <Main>
            <Box>
              {isLoading ? <Loader /> : null}
              {!isLoading && !error && (
                <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
              )}
              {error && <ErrorMessage message={error} />}
            </Box>

            <Box>
              {selectId ? (
                <MovieDetails
                  selectId={selectId}
                  onCloseMovie={handleCloseMovie}
                  onAddWatched={handleAddWatched}
                  watched={watched}
                  userDetails={userDetails}
                />
              ) : !selectListId ? (
                <>
                  <PlaylisySummary
                    plyName={"Playlist Created By You"}
                    userDetails={userDetails}
                  />
                  <SectionPlayList
                    watched={playlistDetails}
                    onSelectPlaylist={handleSelectPlaylist}
                    onDelete={handleDeleteWatched}
                    setPlyName={setPlyName}
                  />
                </>
              ) : (
                <>
                  <PlaylisySummaryInternal
                    plyName={plyName}
                    selectListId={selectListId}
                  />
                  <WatchedMoviesList
                    onCloseMovie={handleClosePly}
                    selectListId={selectListId}
                    onDelete={handleDeleteWatched}
                  />
                </>
              )}
            </Box>
          </Main>
        </>
      )}
    </>
  );
};

const CreatePlaylist = ({ onCreate }) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const handleCreateClick = () => {
    if (playlistName.trim()) {
      onCreate(playlistName);
      setPlaylistName("");
    } else {
      alert("Playlist name can't be empty");
    }
  };

  return (
    <div className="create-playlist-container">
      <h2>Create a New Playlist</h2>
      <input
        type="text"
        placeholder="Enter playlist name"
        value={playlistName}
        onChange={handleInputChange}
        className="playlist-input"
      />
      <button onClick={handleCreateClick} className="create-button">
        Create Playlist
      </button>
    </div>
  );
};

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
      const res = await fetch(`http://localhost:3000/moviedata/${selectId}`);
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
function PlayListForm({
  onCreatePlaylist,
  setShowPopup,
  userDetails,
  movieId,
}) {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://fasal-backend.vercel.app/playlists/${userDetails._id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [showCreateForm]);

  const onSelectPlaylist = async (id) => {
    console.log();
    try {
      await fetch("https://fasal-backend.vercel.app/movielist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie: movieId,
          playlist: id,
        }),
      });
      setShowPopup(false);
    } catch (error) {
      console.error("Failed to add movie to playlist:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      await fetch("https://fasal-backend.vercel.app/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPlaylistName,
          movienum: 0,
          userId: userDetails._id,
          isPublic: true,
        }),
      });
      setShowCreateForm(false);
      setNewPlaylistName("");
      fetchPlaylists();
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        {!showCreateForm ? (
          <>
            <h2>Playlists Created by You</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <ul>
              {playlists.map((playlist) => (
                <li
                  key={playlist._id}
                  onClick={() => onSelectPlaylist(playlist._id)}
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowCreateForm(true)}>
              Create New Playlist
            </button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </>
        ) : (
          <div className="create-playlist-form">
            <h2>Create New Playlist</h2>
            <input
              type="text"
              placeholder="Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button onClick={handleCreatePlaylist}>Create</button>
            <button onClick={() => setShowCreateForm(false)}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
function NavBar({ children, onLogoutClick, profileData }) {
  return (
    <nav className="nav-bar">
      <div className="nav-left">{children}</div>
      <div className="nav-right">
        <Userdata onLogoutClick={onLogoutClick} data={profileData} />
      </div>
    </nav>
  );
}

function Userdata({ onLogoutClick, data }) {
  // console.log(data);
  return (
    <div className="user-data">
      {data != null && (
        <h2 className="user-details">
          Logged in as {data.fname} {data.lname}
        </h2>
      )}
      <button className="menu-icon" onClick={onLogoutClick}>
        <h1 role="img" aria-label="Logout">
          🚪
        </h1>
        <span className="btn-class">Logout</span>
      </button>
    </div>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <span>
        <h1>fasalPopcorn</h1>
      </span>
      <h3>by Aman</h3>
    </div>
  );
}

function Search({ query, setQuery }) {
  // const inputEl = useRef(null);
  // useKey("Enter", function () {
  //   if (document.activeElement === inputEl.current) {
  //     return;
  //   }
  //   inputEl.current.focus();
  //   setQuery("");
  // });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function PlaylisySummary({ lists, plyName, userDetails }) {
  const navigate = useNavigate();
  const handleButton = () => {
    navigate(`/movies/${userDetails._id}`);
    console.log();
  };

  return (
    <div className="summary">
      <h2>{plyName}</h2>
      <div>
        <p>
          <button className="button-share" onClick={handleButton}>
            Sharable Public Playlist Link
          </button>
        </p>
      </div>
    </div>
  );
}
// function PlaylisySummaryInternal({ lists, plyName, selectListId }) {
//   const [isPublic, setIsPublic] = useState(null);

//   useEffect(() => {
//     const fetchPlaylist = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/getplaylist/${selectListId}`
//         );
//         if (res.ok) {
//           const data = await res.json();
//           setIsPublic(data.isPublic);
//         } else {
//           console.error("Error fetching playlist data");
//         }
//       } catch (error) {
//         console.error("An error occurred while fetching playlist data:", error);
//       }
//     };

//     fetchPlaylist();
//   }, []);

//   const handleTogglePublic = async () => {
//     setIsPublic((prevIsPublic) => !prevIsPublic);
//     try {
//       const response = await fetch(
//         `http://localhost:3000/playlist/${selectListId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({ isPublic: !isPublic }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update playlist");
//       }

//       const result = await response.json();
//       console.log("Update successful", result);
//     } catch (error) {
//       console.error("Error updating playlist:", error);
//     }
//   };

//   return (
//     <div className="summary">
//       <h2>{plyName}</h2>
//       <div>
//         <strong>This playlist is {isPublic ? "Public" : "Private"}</strong>
//         <button className="button-toggle-public" onClick={handleTogglePublic}>
//           Make it {!isPublic ? "Public" : "Private"}
//         </button>
//       </div>
//     </div>
//   );
// }

function PlaylisySummaryInternal({ plyName, selectListId }) {
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(
          `https://fasal-backend.vercel.app/getplaylist/${selectListId}`
        );
        if (res.ok) {
          const data = await res.json();
          // console.log("12345");
          // console.log(data);
          setIsPublic(data[0].isPublic); // Set the initial public status
        } else {
          console.error("Error fetching playlist data");
        }
      } catch (error) {
        console.error("An error occurred while fetching playlist data:", error);
      }
    };

    fetchPlaylist();
  }, []); // Trigger the effect when selectListId changes

  const handleTogglePublic = async () => {
    try {
      const response = await fetch(
        `https://fasal-backend.vercel.app/playlist/${selectListId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ isPublic: !isPublic }), // Invert the current status
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }

      const result = await response.json();
      // console.log("Update successful", result);
      setIsPublic(!isPublic); // Update the local state
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  return (
    <div className="summary">
      <h2>{plyName}</h2>
      <div>
        <strong>This playlist is {isPublic ? "Public" : "Private"}</strong>
        <button className="button-toggle-public" onClick={handleTogglePublic}>
          Make it {!isPublic ? "Public" : "Private"}
        </button>
      </div>
    </div>
  );
}

function SectionPlayList({ watched, onSelectPlaylist, setPlyName, onDelete }) {
  return (
    <div className="playlist-section">
      <ul className="list">
        {watched != null &&
          watched.map((item) => (
            <PlaylistList
              key={item._id}
              list={item}
              onDelete={onDelete}
              onSelectPlaylist={onSelectPlaylist}
              setPlyName={setPlyName}
            />
          ))}
      </ul>
    </div>
  );
}

function PlaylistList({
  list,
  onSelectPlaylist,
  setPlyName,
  onDelete,
  handleToggle,
}) {
  const [isPublic, setIsPublic] = useState(false); // Default to "No"

  const handleClick = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    onSelectPlaylist(list._id);
    setPlyName(list.name);
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    onDelete(list._id);
  };

  return (
    <li className="playlist-item" onClick={handleClick}>
      <h3 id="playlist-name">{list.name}</h3>
      <div className="playlist-info">
        <p id="isPublic">
          <strong>Is Public:</strong> {list.isPublic ? "Yes" : "No"}
        </p>
        <button className="btn-delete" onClick={handleDelete}>
          X
        </button>
      </div>
    </li>
  );
}
// TESTING
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
// TESTING
function WatchedMovie({ movie, onDelete }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://fasal-backend.vercel.app/${movie.movie}`
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

function Login({ setIsLogin, setSign, setUserDetails, fetchUserDetails }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://fasal-backend.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setIsLogin(false);
        fetchUserDetails(decoded.id);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button type="submit">Login</Button>
        <LinkText onClick={() => setSign(false)}>
          Don't have an account? Sign up
        </LinkText>
      </Form>
    </Container>
  );
}

const Signup = ({ setIsLogin, setSign, setUserDetails, fetchUserDetails }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://fasal-backend.vercel.app/userRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fname: firstName,
            lname: lastName,
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        // console.log(decoded.id);
        setIsLogin(false);
        fetchUserDetails(decoded.id);
      } else {
        const data2 = await response.json();
        setError(data2.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An error occurred during signup. Please try again later.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Signup</Title>
        {error && <ErrorMessage message={error} />}
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit">Signup</Button>
        <div>
          Have an account?{" "}
          <LinkText onClick={() => setSign(true)}>Login</LinkText>
        </div>
      </Form>
    </Container>
  );
};
