'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LabContextType {
    showOverlay: boolean;
    setShowOverlay: (show: boolean) => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export function LabProvider({ children }: { children: ReactNode }) {
    const [showOverlay, setShowOverlay] = useState(false);

    return (
        <LabContext.Provider value={{ showOverlay, setShowOverlay }}>
            {children}
        </LabContext.Provider>
    );
}

export function useLab() {
    const context = useContext(LabContext);
    if (context === undefined) {
        throw new Error('useLab must be used within a LabProvider');
    }
    return context;
}
