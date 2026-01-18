import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HeaderContext = createContext({
  header: null,
  setHeader: () => {},
});

export const HeaderProvider = ({ children }) => {
  const [header, setHeader] = useState(null);
  const location = useLocation();

  // Reset header on route change
  useEffect(() => {
    setHeader(null);
  }, [location.pathname]);

  return (
    <HeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);
