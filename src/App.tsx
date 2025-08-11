import { useRoutes } from "react-router-dom";
import { routes } from "../src/routes/routes"; // Ajusta la ruta si está en otro lugar

function App() {
  const element = useRoutes(routes);
  return <>{element}</>;
}

export default App;
