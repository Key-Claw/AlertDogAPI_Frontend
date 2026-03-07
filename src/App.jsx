import './App.css';
import { AppContextProvider } from './context/AppContext.jsx';
import AppRoutes from './routes/index.jsx';

function App() {
  return (
    <AppContextProvider>
      <AppRoutes />
    </AppContextProvider>
  );
}

export default App;