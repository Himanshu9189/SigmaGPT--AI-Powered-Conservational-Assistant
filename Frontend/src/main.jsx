
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { MyContextProvider } from './MyContext.jsx';
import { ThemeProvider } from './ThemeContent.jsx';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <MyContextProvider>
                <App />
            </MyContextProvider>
        </ThemeProvider>
    </StrictMode>,
);
