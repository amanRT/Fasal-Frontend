import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocalStorageState } from "./components/useLocalStorageState";
import { jwtDecode } from "jwt-decode";
import { useMovies } from "./components/useMovie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

function Tilt3DCard({ children, className, style, onClick }) {
  const ref = useRef(null);
  const [tf, setTf] = useState("");

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -6;
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6;
    setTf(`perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`);
  }, []);

  const onLeave = useCallback(() => {
    setTf("perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)");
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transform: tf, transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)", transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ============================================================
   UTILITY COMPONENTS
   ============================================================ */

function Loader() {
  return (
    <div className="loader-container">
      <p className="loader">Loading</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return <p className="error-message">⛔ {message}</p>;
}

/* ============================================================
   PUBLIC PAGES
   ============================================================ */

const PublicPlaylistsPage = () => {
  const { id } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [playSelect, setPlaySelect] = useState(true);
  const [playlistid, setPlaylistid] = useState(null);
  const [watched, setWatched] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  async function loadProfile() {
    try {
      const response = await fetch(`https://fasal-backend.vercel.app/getspecificuser/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`https://fasal-backend.vercel.app/playlists/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPlaylists(data.filter((p) => p.isPublic));
        await loadProfile();
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    fetchPlaylists();
  }, [id]);

  useEffect(() => {
    const fetchContent = async () => {
      if (playlistid != null) {
        try {
          const response = await fetch(`https://fasal-backend.vercel.app/movielists/${playlistid}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setWatched(data);
          setPlaySelect(false);
        } catch (error) {
          console.error("Failed to fetch playlists:", error);
        }
      }
    };
    fetchContent();
  }, [playlistid]);

  return (
    <AnimatePresence mode="wait">
      {playSelect ? (
        <motion.div
          key="select"
          className="public-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="btn-home" onClick={() => navigate("/")}>
            &larr;
          </button>
          <motion.div
            className="page-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>
              Public Playlists of{" "}
              <span>{profile ? `${profile.fname} ${profile.lname}` : "..."}</span>
            </h1>
            <p>Browse their curated movie collections</p>
          </motion.div>
          <motion.div
            className="public-playlists-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {playlists.map((playlist, i) => (
              <motion.div key={playlist._id} variants={fadeInUp} custom={i}>
                <Tilt3DCard
                  className="public-playlist-card"
                  onClick={() => setPlaylistid(playlist._id)}
                >
                  <h3>{playlist.name}</h3>
                  <p>Click to view movies</p>
                </Tilt3DCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <PublicMoviesPage key="movies" mo={watched} onBack={() => setPlaySelect(true)} />
      )}
    </AnimatePresence>
  );
};

const PublicMoviesPage = ({ mo, onBack }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = await Promise.all(
          mo.map(async (m) => {
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${m.movie}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
        );
        setMovies(fetched);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };
    fetchData();
  }, [mo]);

  return (
    <motion.div
      className="public-page"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
    >
      <button className="btn-home" onClick={onBack}>
        &larr;
      </button>
      <div className="page-header">
        <h1>
          <span>Movie Collection</span>
        </h1>
      </div>
      <motion.div
        className="movie-grid"
        style={{ maxWidth: "100rem", margin: "0 auto" }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {movies.map((movie, i) => (
          <motion.div key={movie.imdbID} variants={fadeInUp} custom={i}>
            <Tilt3DCard className="movie-card">
              <img src={movie.Poster} alt={movie.Title} className="card-poster" />
              <div className="card-info">
                <div className="card-rating">
                  <span>⭐</span> {movie.imdbRating}
                </div>
                <p className="card-title">{movie.Title}</p>
                <p className="card-meta">{movie.Runtime}</p>
              </div>
            </Tilt3DCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   APP ROUTER
   ============================================================ */

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/movies/:id" element={<PublicPlaylistsPage />} />
      </Routes>
    </Router>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

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
      const response = await fetch(`https://fasal-backend.vercel.app/getspecificuser/${id}`);
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
        const response = await fetch(`https://fasal-backend.vercel.app/playlists/${userDetails._id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
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

  useEffect(() => {}, [render]);

  function handleSelectMovie(id) {
    setSelectId((prev) => (id === prev ? null : id));
  }

  function handleCloseMovie() {
    setSelectId(null);
  }

  function handleAddWatched(movie) {
    setWatched((w) => [...w, movie]);
  }

  const handleDeleteWatched = async (id) => {
    try {
      const response = await fetch(`https://fasal-backend.vercel.app/playlist/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Failed to delete: ${response.status}`);
      setRender((r) => !r);
      fetchPlaylists();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    setIsLogin(true);
    setUserDetails(null);
  };

  const handleQueryChange = (q) => {
    setQuery(q);
    if (q) {
      setSelectListId(null);
      setPlyName(null);
    }
  };

  const handlePlaylistClick = (id, name) => {
    setSelectListId((prev) => (prev === id ? null : id));
    setPlyName(name);
    setQuery("");
  };

  const handleClosePly = () => {
    setSelectListId(null);
    setPlyName(null);
  };

  return (
    <AnimatePresence mode="wait">
      {isLogin ? (
        <motion.div
          key={signType ? "login" : "signup"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {signType ? (
            <Login setIsLogin={setIsLogin} setSign={setSign} setUserDetails={setUserDetails} fetchUserDetails={fetchUserDetails} />
          ) : (
            <Signup setIsLogin={setIsLogin} setSign={setSign} setUserDetails={setUserDetails} fetchUserDetails={fetchUserDetails} />
          )}
        </motion.div>
      ) : (
        <motion.div
          key="app"
          className="app-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <NavBar
            query={query}
            setQuery={handleQueryChange}
            userDetails={userDetails}
            onLogout={handleLogoutClick}
          />
          <div className="app-body">
            <Sidebar
              playlists={playlistDetails}
              selectedId={selectListId}
              onSelect={handlePlaylistClick}
              onDelete={handleDeleteWatched}
              userDetails={userDetails}
            />
            <main className="content-area">
              <AnimatePresence mode="wait">
                {query && isLoading ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader />
                  </motion.div>
                ) : query && error ? (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ErrorMessage message={error} />
                  </motion.div>
                ) : query && movies.length > 0 ? (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="content-header">
                      <h2>Search Results</h2>
                      <span className="result-count">{movies.length} movies found</span>
                    </div>
                    <MovieGrid movies={movies} onSelectMovie={handleSelectMovie} />
                  </motion.div>
                ) : selectListId ? (
                  <motion.div
                    key={`playlist-${selectListId}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <PlaylistView
                      selectListId={selectListId}
                      plyName={plyName}
                      onClose={handleClosePly}
                      onSelectMovie={handleSelectMovie}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <WelcomeState />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>

          <AnimatePresence>
            {selectId && (
              <MovieDetailOverlay
                selectId={selectId}
                onClose={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
                userDetails={userDetails}
                onPlaylistChange={fetchPlaylists}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================
   NAVBAR
   ============================================================ */

function NavBar({ query, setQuery, userDetails, onLogout }) {
  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-brand">
        <span className="brand-icon">🍿</span>
        <h1>fasalPopcorn</h1>
      </div>

      <div className="navbar-search">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search for any movie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-user">
        {userDetails && (
          <motion.span
            className="user-greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hi, <strong>{userDetails.fname}</strong>
          </motion.span>
        )}
        <motion.button
          className="btn-logout"
          onClick={onLogout}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          🚪 Logout
        </motion.button>
      </div>
    </motion.nav>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */

function Sidebar({ playlists, selectedId, onSelect, onDelete, userDetails }) {
  const navigate = useNavigate();

  return (
    <motion.aside
      className="sidebar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="sidebar-header">
        <h2>My Playlists</h2>
      </div>

      <ul className="sidebar-list">
        <AnimatePresence>
          {playlists &&
            playlists.map((item, i) => (
              <motion.li
                key={item._id}
                className={`sidebar-item${selectedId === item._id ? " active" : ""}`}
                onClick={() => onSelect(item._id, item.name)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ x: 4 }}
              >
                <div className="item-info">
                  <p className="item-name">{item.name}</p>
                  <p className={`item-badge${item.isPublic ? " public" : ""}`}>
                    {item.isPublic ? "🌐 Public" : "🔒 Private"}
                  </p>
                </div>
                <div className="item-actions">
                  <button
                    className="btn-delete-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item._id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </motion.li>
            ))}
        </AnimatePresence>
        {playlists && playlists.length === 0 && (
          <div className="empty-state" style={{ padding: "3rem 1rem" }}>
            <p className="empty-icon">📂</p>
            <p>No playlists yet</p>
          </div>
        )}
      </ul>

      <div className="sidebar-footer">
        {userDetails && (
          <button
            className="btn-sidebar ghost"
            onClick={() => navigate(`/movies/${userDetails._id}`)}
          >
            🔗 Share Public Playlists
          </button>
        )}
      </div>
    </motion.aside>
  );
}

/* ============================================================
   MOVIE GRID (Search Results)
   ============================================================ */

function MovieGrid({ movies, onSelectMovie }) {
  return (
    <motion.div
      className="movie-grid"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {movies?.map((movie, i) => (
        <motion.div key={movie.imdbID} variants={fadeInUp} custom={i}>
          <Tilt3DCard
            className="movie-card"
            onClick={() => onSelectMovie(movie.imdbID)}
          >
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"}
              alt={movie.Title}
              className="card-poster"
            />
            <div className="card-info">
              <p className="card-title">{movie.Title}</p>
              <p className="card-meta">
                <span>📅</span> {movie.Year}
              </p>
            </div>
          </Tilt3DCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ============================================================
   MOVIE DETAIL OVERLAY
   ============================================================ */

function MovieDetailOverlay({ selectId, onClose, onAddWatched, watched, userDetails, onPlaylistChange }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    async function getMovie() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovie();
  }, [selectId]);

  useEffect(() => {
    if (!title) return;
    document.title = `MOVIE | ${title}`;
    return () => {
      document.title = "fasalPopcorn";
    };
  }, [title]);

  const handleAdd = () => setShowPopup(true);

  return (
    <>
      <motion.div
        className="overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.div
          className="overlay-card"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="overlay-close" onClick={onClose}>
            ✕
          </button>

          {isLoading ? (
            <Loader />
          ) : (
            <div className="overlay-hero">
              <div className="overlay-poster">
                <img src={poster} alt={title} />
              </div>
              <div className="overlay-details">
                <h1>{title}</h1>
                <div className="overlay-meta">
                  <span className="meta-tag">📅 {released}</span>
                  <span className="meta-tag">⏱ {runtime}</span>
                  <span className="meta-rating">⭐ {imdbRating}</span>
                </div>
                {genre && (
                  <div className="overlay-genre">
                    {genre.split(", ").map((g) => (
                      <span key={g} className="genre-chip">{g}</span>
                    ))}
                  </div>
                )}
                <p className="overlay-plot">{plot}</p>
                <div className="overlay-credits">
                  <p>
                    <strong>Starring:</strong> {actors}
                  </p>
                  <p>
                    <strong>Director:</strong> {director}
                  </p>
                </div>
                <div className="overlay-actions">
                  <motion.button
                    className="btn-add-playlist"
                    onClick={handleAdd}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    ＋ Add to Playlist
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {showPopup && (
        <PlayListForm
          setShowPopup={setShowPopup}
          userDetails={userDetails}
          movieId={selectId}
          onPlaylistChange={onPlaylistChange}
        />
      )}
    </>
  );
}

/* ============================================================
   PLAYLIST FORM POPUP
   ============================================================ */

function PlayListForm({ setShowPopup, userDetails, movieId, onPlaylistChange }) {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://fasal-backend.vercel.app/playlists/${userDetails._id}`);
      if (!response.ok) throw new Error("Failed to fetch playlists");
      const data = await response.json();
      setPlaylists(data);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [showCreateForm]);

  const onSelectPlaylist = async (id) => {
    try {
      await fetch("https://fasal-backend.vercel.app/movielist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie: movieId, playlist: id }),
      });
      if (onPlaylistChange) onPlaylistChange();
      setShowPopup(false);
    } catch (err) {
      console.error("Failed to add movie to playlist:", err);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      await fetch("https://fasal-backend.vercel.app/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      if (onPlaylistChange) onPlaylistChange();
    } catch (err) {
      console.error("Failed to create playlist:", err);
    }
  };

  return (
    <motion.div
      className="popup-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowPopup(false)}
    >
      <motion.div
        className="popup-card"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        {!showCreateForm ? (
          <>
            <h2>Choose a Playlist</h2>
            {loading && <p style={{ color: "var(--color-text-muted)", fontSize: "1.3rem" }}>Loading...</p>}
            {error && <p style={{ color: "var(--color-red)", fontSize: "1.3rem" }}>{error}</p>}
            <ul className="popup-list">
              {playlists.map((pl) => (
                <li key={pl._id} onClick={() => onSelectPlaylist(pl._id)}>
                  {pl.name}
                </li>
              ))}
            </ul>
            <div className="popup-actions">
              <button className="btn-popup primary" onClick={() => setShowCreateForm(true)}>
                ＋ New Playlist
              </button>
              <button className="btn-popup ghost" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="popup-create-form">
            <h2>Create Playlist</h2>
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <div className="popup-actions">
              <button className="btn-popup primary" onClick={handleCreatePlaylist}>
                Create
              </button>
              <button className="btn-popup ghost" onClick={() => setShowCreateForm(false)}>
                Back
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   PLAYLIST VIEW (Content Area)
   ============================================================ */

function PlaylistView({ selectListId, plyName, onClose, onSelectMovie }) {
  const [isPublic, setIsPublic] = useState(true);
  const [movies, setMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  useEffect(() => {
    const fetchPlaylistMeta = async () => {
      try {
        const res = await fetch(`https://fasal-backend.vercel.app/getplaylist/${selectListId}`);
        if (res.ok) {
          const data = await res.json();
          setIsPublic(data[0].isPublic);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
      }
    };
    fetchPlaylistMeta();
  }, [selectListId]);

  useEffect(() => {
    const fetchPlaylistMovies = async () => {
      setLoadingMovies(true);
      try {
        const res = await fetch(`https://fasal-backend.vercel.app/movielists/${selectListId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Failed to fetch playlist movies:", err);
      }
    };
    fetchPlaylistMovies();
  }, [selectListId]);

  useEffect(() => {
    const fetchAllDetails = async () => {
      if (movies.length === 0) {
        setMoviesData([]);
        setLoadingMovies(false);
        return;
      }
      try {
        const details = await Promise.all(
          movies.map(async (m) => {
            const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${m.movie}`);
            return res.json();
          })
        );
        setMoviesData(details);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchAllDetails();
  }, [movies]);

  const handleTogglePublic = async () => {
    try {
      const response = await fetch(`https://fasal-backend.vercel.app/playlist/${selectListId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (!response.ok) throw new Error("Failed to update playlist");
      setIsPublic(!isPublic);
    } catch (err) {
      console.error("Error updating playlist:", err);
    }
  };

  return (
    <>
      <div className="playlist-view-header">
        <div className="pv-left">
          <motion.button
            className="btn-text back"
            onClick={onClose}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            ← Back
          </motion.button>
          <h2>{plyName}</h2>
          <span className={`pv-badge ${isPublic ? "public" : "private"}`}>
            {isPublic ? "🌐 Public" : "🔒 Private"}
          </span>
        </div>
        <div className="header-actions">
          <motion.button
            className="btn-toggle-vis"
            onClick={handleTogglePublic}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Make {isPublic ? "Private" : "Public"}
          </motion.button>
        </div>
      </div>

      {loadingMovies ? (
        <Loader />
      ) : moviesData.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🎬</p>
          <p>This playlist is empty. Search for movies to add them here.</p>
        </div>
      ) : (
        <motion.div
          className="movie-grid"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {moviesData.map((movie, i) => (
            <motion.div key={movie.imdbID || i} variants={fadeInUp} custom={i}>
              <Tilt3DCard
                className="movie-card"
                onClick={() => onSelectMovie(movie.imdbID)}
              >
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"}
                  alt={movie.Title}
                  className="card-poster"
                />
                <div className="card-info">
                  <div className="card-rating">
                    <span>⭐</span> {movie.imdbRating}
                  </div>
                  <p className="card-title">{movie.Title}</p>
                  <p className="card-meta">{movie.Runtime}</p>
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}

/* ============================================================
   WELCOME STATE
   ============================================================ */

function WelcomeState() {
  return (
    <motion.div
      className="welcome-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="welcome-icon"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🍿
      </motion.div>
      <h2>Welcome to fasalPopcorn</h2>
      <p>
        Search for any movie to explore details, or browse your playlists in the sidebar to manage your collections.
      </p>
      <div className="welcome-tips">
        <div className="welcome-tip">
          <span className="tip-icon">🔍</span>
          <span>Search movies above</span>
        </div>
        <div className="welcome-tip">
          <span className="tip-icon">📂</span>
          <span>Select a playlist</span>
        </div>
        <div className="welcome-tip">
          <span className="tip-icon">🔗</span>
          <span>Share public playlists</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   AUTH: LOGIN
   ============================================================ */

function Login({ setIsLogin, setSign, setUserDetails, fetchUserDetails }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://fasal-backend.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

/* ============================================================
   AUTH: SIGNUP
   ============================================================ */

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
      const response = await fetch("https://fasal-backend.vercel.app/userRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fname: firstName, lname: lastName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setIsLogin(false);
        fetchUserDetails(decoded.id);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError("An error occurred during signup. Please try again later.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Signup</Title>
        {error && <ErrorMessage message={error} />}
        <Input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <Button type="submit">Signup</Button>
        <div style={{ fontSize: "1.3rem", color: "var(--color-text-secondary)" }}>
          Have an account? <LinkText onClick={() => setSign(true)}>Login</LinkText>
        </div>
      </Form>
    </Container>
  );
};
