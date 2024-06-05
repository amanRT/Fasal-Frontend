import PlaylistList from "./PlaylistList";
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

export default SectionPlayList;
