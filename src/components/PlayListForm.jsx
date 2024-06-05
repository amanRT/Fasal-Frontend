import { useState, useEffect } from "react";
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
export default PlayListForm;
