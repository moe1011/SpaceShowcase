// import { useState, useEffect, useCallback } from "react";
import "./App.css";
import NasaImage from "./components/NasaImage";

function App() {

  return (
    <div className="App w-screen min-h-screen bg-linear-to-b/oklch from-blue-900 via-indigo-900 to-pink-900 pt-10 px-10 sm:px-20 pb-20 
    font-[var(--font-arcane)]"
    >
      <NasaImage/>
    </div>
  );
}

export default App;