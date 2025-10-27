// src/context/branch/BranchContext.js
import { createContext } from 'react';

export const BranchContext = createContext({
    currentBranch: null,
    setCurrentBranch: () => { },
    allBranches: [],
    setAllBranches: () => { },
    updateSelectedBranch: () => { }
});
