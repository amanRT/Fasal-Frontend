import { useNavigate } from "react-router-dom";
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
export default PlaylisySummary;
