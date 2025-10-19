
import React from 'react';

type IconProps = {
  className?: string;
};

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5a3 3 0 1 0-5.993.129M12 5a3 3 0 1 1 5.993.129M12 12a3 3 0 1 0-5.993.129M12 12a3 3 0 1 1 5.993.129M12 19a3 3 0 1 0-5.993.129M12 19a3 3 0 1 1 5.993.129M19 12a3 3 0 1 0-5.993.129M5 12a3 3 0 1 0-5.993.129M19 5a3 3 0 1 0-5.993.129M5 5a3 3 0 1 0-5.993.129M19 19a3 3 0 1 0-5.993.129M5 19a3 3 0 1 0-5.993.129" /><path d="M12 5v0" /><path d="M12 12v0" /><path d="M12 19v0" /><path d="M19 12v0" /><path d="M5 12v0" /><path d="M19 5v0" /><path d="M5 5v0" /><path d="M19 19v0" /><path d="M5 19v0" /><path d="m14 17-2-3" /><path d="m10 14-2-3" /><path d="M10 10 8 7" /><path d="m14 7-2 3" /><path d="M7 5.129A3 3 0 0 0 5 5" /><path d="M7 19.129A3 3 0 0 0 5 19" /><path d="M17 5.129A3 3 0 0 1 19 5" /><path d="M17 19.129A3 3 0 0 1 19 19" /><path d="M12 7.129A3 3 0 0 0 12 5" /><path d="M12 14.129A3 3 0 0 0 12 12" /><path d="M12 21.129A3 3 0 0 0 12 19" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

export const CommitIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/>
    </svg>
);

export const IssueIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/><path d="M12 8h.01"/>
    </svg>
);

export const PullRequestIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/>
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
