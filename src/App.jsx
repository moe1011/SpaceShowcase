// import { useState, useEffect, useCallback } from "react";
import "./App.css";
import NasaImage from "./components/NasaImage";
import Footer from "./components/Footer";
// import TTSTest from "./components/TTSTest";

function App() {
  return (
    <div
      className="App w-screen min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-pink-900 pt-10 px-10 pb-32 sm:pb-5 
    font-[var(--font-arcane)]"
    >
      <div className="min-h-screen flex flex-col justify-between space-y-24 sm:space-y-14">
        <NasaImage />

        <Footer />
      </div>
    </div>
  );
}

export default App;
