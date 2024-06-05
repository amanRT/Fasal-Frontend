import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieDetailsPage from "./components/MovieDetailsPage";
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
            `https://fasal-backend.vercel.app/movielists/${playlistid}`
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
export default PublicPlaylistsPage;
