import { useRoutes } from "react-router-dom";
import { routes } from "../src/routes/routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const element = useRoutes(routes);
  return <AuthProvider>{element}</AuthProvider>;
}

export default App;
