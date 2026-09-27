import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_CONFIG as defaultAppConfig } from '../agencyConfig';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('demo_app_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        return { ...defaultAppConfig, ...parsed, features: { ...defaultAppConfig.features, ...parsed.features }, services: parsed.services || defaultAppConfig.services };
      } catch (e) {
        console.error('Error parsing config from localStorage', e);
      }
    }
    return defaultAppConfig;
  });

  useEffect(() => {
    localStorage.setItem('demo_app_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const toggleFeature = (featureName) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureName]: !prev.features[featureName]
      }
    }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, toggleFeature }}>
      {children}
    </ConfigContext.Provider>
  );
};
