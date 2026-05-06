import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";


function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppRoutes />
  );
}

export default App;