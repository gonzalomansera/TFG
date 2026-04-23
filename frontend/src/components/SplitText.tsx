import React from 'react';

interface SplitTextProps {
    children: string;
    className?: string;
    type?: 'words' | 'chars';
}

export const SplitText: React.FC<SplitTextProps> = ({ children, className = '', type = 'chars' }) => {
    if (type === 'words') {
        const words = children.split(' ');
        return (
            <span className={className}>
                {words.map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden align-top">
                        <span className="inline-block animate-target">
                            {word}
                            {i < words.length - 1 && '\u00A0'}
                        </span>
                    </span>
                ))}
            </span>
        );
    }

    // Default to chars
    return (
        <span className={`${className} inline-block`}>
            {children.split('').map((char, i) => (
                <span key={i} className="inline-block overflow-hidden align-top">
                    <span className="inline-block animate-target">
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                </span>
            ))}
        </span>
    );
};
