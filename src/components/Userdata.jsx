function Userdata({ onLogoutClick, data }) {
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
export default Userdata;
