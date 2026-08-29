import React, { createContext, useContext, useState } from 'react';

export type AtmosphereTheme = 'dark' | 'light';

interface AtmosphereContextType {
  atmosphere: AtmosphereTheme;
  setAtmosphere: (theme: AtmosphereTheme) => void;
  headerVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
}

const AtmosphereContext = createContext<AtmosphereContextType>({
  atmosphere: 'dark',
  setAtmosphere: () => {},
  headerVisible: false,
  setHeaderVisible: () => {},
});

export const AtmosphereProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [atmosphere, setAtmosphere] = useState<AtmosphereTheme>('dark');
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);

  return (
    <AtmosphereContext.Provider
      value={{
        atmosphere,
        setAtmosphere,
        headerVisible,
        setHeaderVisible,
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  );
};

export const useAtmosphere = () => useContext(AtmosphereContext);
