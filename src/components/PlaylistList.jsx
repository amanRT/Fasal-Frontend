import { useState } from "react";
function PlaylistList({
  list,
  onSelectPlaylist,
  setPlyName,
  onDelete,
  handleToggle,
}) {
  const [isPublic, setIsPublic] = useState(false); 

  const handleClick = (event) => {
    event.stopPropagation(); 
    onSelectPlaylist(list._id);
    setPlyName(list.name);
  };

  const handleDelete = (event) => {
    event.stopPropagation(); 
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
export default PlaylistList;
