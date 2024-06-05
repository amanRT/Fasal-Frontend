import React, { useState, useEffect, useRef } from "react";
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
