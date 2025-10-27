// src/context/branch/BranchProvider.jsx
import { useState, useEffect } from 'react';
import { BranchContext } from './BranchContext';

export const BranchProvider = ({ children }) => {
    const [currentBranch, setCurrentBranch] = useState(null);
    const [allBranches, setAllBranches] = useState([]);

    useEffect(() => {
        // You can fetch or initialize branches here if needed
    }, []);

    const updateSelectedBranch = (selectedId) => {
        setAllBranches((prev) =>
            prev.map((branch) => {
                const updated = { ...branch, is_selected: branch.id === selectedId };
                if (updated.is_selected) setCurrentBranch(updated);
                return updated;
            })
        );
    };

    const values = {
        currentBranch,
        setCurrentBranch,
        allBranches,
        setAllBranches,
        updateSelectedBranch
    };

    return (
        <BranchContext.Provider value={values}>
            {children}
        </BranchContext.Provider>
    );
};
