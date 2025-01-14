// import { useState, useEffect, useCallback } from "react";
import "./App.css";
import NasaImage from "./components/NasaImage";
import TTSTest from "./components/TTSTest";

function App() {

  return (
    <div className="App w-screen min-h-screen bg-linear-to-b/oklch from-blue-900 via-indigo-900 to-pink-900 pt-10 px-10 sm:px-14 pb-28 sm:pb-20 
    font-[var(--font-arcane)]"
    >
      <NasaImage/>
      {/* <TTSTest/> */}
    </div>
  );
}

export default App;