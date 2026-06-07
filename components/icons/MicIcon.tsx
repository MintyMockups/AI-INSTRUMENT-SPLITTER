import React from 'react';

export const MicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a3 3 0 013-3v-1.5a3 3 0 00-6 0v1.5a3 3 0 013 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v3.75m0-11.25v-1.5m0 0a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);
