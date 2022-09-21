import { createContext, useContext } from 'react';
import { MainStore } from './stores/MainStore';

const store = {
  MainStore: new MainStore(),
};

const RootStore = createContext(store);

const useStore = () => useContext(RootStore);

export { store, RootStore, useStore };
