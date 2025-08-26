import React from 'react';

const CustomSproutIcon = ({ className, leafColor = 'white', stemColor = '#D44A3A' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 20h10" stroke={stemColor} />
    <path d="M10 20v-2a2.4 2.4 0 0 1 .4-1.3c.3-.6.8-1.1 1.6-1.7.9-.6 1.9-1.3 2.3-2.5.3-1-.1-2.1-.8-2.8-.7-.7-1.8-.9-2.8-.6-1.1.3-2 .9-2.3 2s.2 2.2 1 2.8" stroke={leafColor} />
    <path d="M14 10.2v-2a2.4 2.4 0 0 0-.4-1.3c-.3-.6-.8-1.1-1.6-1.7-.9-.6-1.9-1.3-2.3-2.5C9.4 3.7 9.6 2.6 10.3 1.9s1.8-.9 2.8-.6c1.1.3 2 .9 2.3 2s-.2 2.2-1 2.8" stroke={leafColor} />
  </svg>
);

export default CustomSproutIcon;