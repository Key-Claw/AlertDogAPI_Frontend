// 1. Cargar estilos base y modulos principales
import './App.css';
import { AppContextProvider } from './context/AppContext.jsx';
import AppRoutes from './routes/index.jsx';

// 2. Envolver toda la app con contexto global y rutas
function App() {
  return (
    <AppContextProvider>
      <AppRoutes />
    </AppContextProvider>
  );
}

export default App;