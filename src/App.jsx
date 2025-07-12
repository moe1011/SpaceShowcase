// import { useState, useEffect, useCallback } from "react";
import "./App.css";
import NasaImage from "./components/NasaImage";
import Footer from "./components/Footer";
import StarField from "./components/StarField";
// import TTSTest from "./components/TTSTest";

function App() {
  return (
    <div
      className="App w-screen min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-pink-900 pt-4 px-10 pb-32 sm:pb-5 
    font-[var(--font-arcane)] relative"
    >
      <StarField />
      <div className="min-h-screen flex flex-col justify-between space-y-24 sm:space-y-14 relative z-10">
        <NasaImage />

        <Footer />
      </div>
    </div>
  );
}

export default App;
