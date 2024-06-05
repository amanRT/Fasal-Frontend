// import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Mainpage from "./Mainpage";
import PublicPlaylistsPage from "./PublicPlaylistspage";
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
// function Main({ children }) {
//   return <main className="main">{children}</main>;
// }
// const Mainpage = () => {
//   const [query, setQuery] = useState("");
//   const [selectId, setSelectId] = useState(null);
//   const [watched, setWatched] = useLocalStorageState([], "watched");
//   const [isLogin, setIsLogin] = useState(!localStorage.getItem("token"));
//   const [signType, setSign] = useState(true);
//   const [userDetails, setUserDetails] = useState(null);
//   const { movies, isLoading, error } = useMovies(query);
//   const [playlistDetails, setPlaylistDetails] = useState(null);
//   const [selectListId, setSelectListId] = useState(null);
//   const [plyName, setPlyName] = useState(null);
//   const [render, setRender] = useState(false);
//   const fetchUserDetails = async (id) => {
//     try {
//       const response = await fetch(
//         `https://fasal-backend.vercel.app/getspecificuser/${id}`
//       );
//       const userData = await response.json();
//       setUserDetails(userData);
//       setIsLogin(false);
//     } catch (error) {
//       console.error("Failed to fetch user details:", error);
//     }
//   };
//   const fetchPlaylists = async () => {
//     if (userDetails != null) {
//       try {
//         const response = await fetch(
//           `https://fasal-backend.vercel.app/playlists/${userDetails._id}`
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         // console.log(data);
//         setPlaylistDetails(data);
//       } catch (error) {
//         console.error("Failed to fetch playlists:", error);
//       }
//     }
//   };
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       fetchUserDetails(decoded.id);
//     }
//   }, []);
//   useEffect(() => {
//     fetchPlaylists();
//   }, [userDetails]);

//   function handleSelectMovie(id) {
//     setSelectId((selectId) => (id === selectId ? null : id));
//   }
//   function handleSelectPlaylist(id) {
//     setSelectListId((selectListId) => (id === selectListId ? null : id));
//   }
//   function handleCloseMovie() {
//     setSelectId(null);
//   }
//   useEffect(() => {}, [selectListId]);
//   function handleClosePly() {
//     setSelectListId(null);
//   }

//   function handleAddWatched(movie) {
//     setWatched((watched) => [...watched, movie]);
//   }

//   const handleDeleteWatched = async (id, setPlaylists, selectedPlaylistId) => {
//     try {
//       const response = await fetch(
//         `https://fasal-backend.vercel.app/playlist/${id}`,
//         {
//           method: "DELETE",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to delete playlist: ${response.status}`);
//       }

//       if (selectedPlaylistId === id) {
//         setRender(!render);
//       }

//       fetchPlaylists();
//     } catch (error) {
//       console.error("Error deleting playlist:", error);
//     }
//   };
//   const handleLogoutClick = () => {
//     localStorage.removeItem("token");
//     setIsLogin(true);
//     setUserDetails(null);
//   };
//   useEffect(() => {
//     console.log();
//   }, [render]);
//   return (
//     <>
//       {isLogin ? (
//         <>
//           {signType ? (
//             <Login
//               setIsLogin={setIsLogin}
//               setSign={setSign}
//               setUserDetails={setUserDetails}
//               fetchUserDetails={fetchUserDetails}
//             />
//           ) : (
//             <Signup
//               setIsLogin={setIsLogin}
//               setSign={setSign}
//               setUserDetails={setUserDetails}
//               fetchUserDetails={fetchUserDetails}
//             />
//           )}
//         </>
//       ) : (
//         <>
//           <NavBar onLogoutClick={handleLogoutClick} profileData={userDetails}>
//             <Logo />
//             <Search query={query} setQuery={setQuery} />
//           </NavBar>

//           <Main>
//             <Box>
//               {isLoading ? <Loader /> : null}
//               {!isLoading && !error && (
//                 <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
//               )}
//               {error && <ErrorMessage message={error} />}
//             </Box>

//             <Box>
//               {selectId ? (
//                 <MovieDetails
//                   selectId={selectId}
//                   onCloseMovie={handleCloseMovie}
//                   onAddWatched={handleAddWatched}
//                   watched={watched}
//                   userDetails={userDetails}
//                 />
//               ) : !selectListId ? (
//                 <>
//                   <PlaylisySummary
//                     plyName={"Playlist Created By You"}
//                     userDetails={userDetails}
//                   />
//                   <SectionPlayList
//                     watched={playlistDetails}
//                     onSelectPlaylist={handleSelectPlaylist}
//                     onDelete={handleDeleteWatched}
//                     setPlyName={setPlyName}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <PlaylisySummaryInternal
//                     plyName={plyName}
//                     selectListId={selectListId}
//                   />
//                   <WatchedMoviesList
//                     onCloseMovie={handleClosePly}
//                     selectListId={selectListId}
//                     onDelete={handleDeleteWatched}
//                   />
//                 </>
//               )}
//             </Box>
//           </Main>
//         </>
//       )}
//     </>
//   );
// };
