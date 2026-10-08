import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_HOMEPAGE_CMS, subscribeHomepageCms, saveHomepageCms } from '../services/cmsService';

export const CmsContext = createContext({
  cms: DEFAULT_HOMEPAGE_CMS,
  loading: true,
  updateCms: () => {},
  saveCms: async () => {},
  resetDefaults: async () => {}
});

export function CmsProvider({ children }) {
  const [cms, setCms] = useState(DEFAULT_HOMEPAGE_CMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeHomepageCms((data) => {
      setCms(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateCms = (updater) => {
    setCms((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  const handleSaveCms = async (dataToSave) => {
    const target = dataToSave || cms;
    await saveHomepageCms(target);
  };

  const resetDefaults = async () => {
    await saveHomepageCms(DEFAULT_HOMEPAGE_CMS);
  };

  return (
    <CmsContext.Provider
      value={{
        cms,
        loading,
        updateCms,
        saveCms: handleSaveCms,
        resetDefaults
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  return context || {
    cms: DEFAULT_HOMEPAGE_CMS,
    loading: false,
    updateCms: () => {},
    saveCms: async () => {},
    resetDefaults: async () => {}
  };
}
