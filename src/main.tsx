import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './utils/createDemoUser'

createRoot(document.getElementById("root")!).render(<App />);
