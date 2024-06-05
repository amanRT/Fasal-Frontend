import Userdata from "./Userdata";
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
export default NavBar;
