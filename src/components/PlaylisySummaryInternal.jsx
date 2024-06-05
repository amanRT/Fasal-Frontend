import { useState, useEffect } from "react";
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

          setIsPublic(data[0].isPublic);
        } else {
          console.error("Error fetching playlist data");
        }
      } catch (error) {
        console.error("An error occurred while fetching playlist data:", error);
      }
    };

    fetchPlaylist();
  }, []);

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
export default PlaylisySummaryInternal;
