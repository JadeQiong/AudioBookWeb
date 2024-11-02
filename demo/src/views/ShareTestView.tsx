// src/components/ShareButtons.tsx

import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

const ShareButtons: React.FC = () => {
  const shareUrl = 'https://booktalks.ai/';
  const title = 'Explore AI-Generated Book Blogs at BookTalks.ai';

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} title={title}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      {/* Add more share buttons as needed */}
    </div>
  );
};

export default ShareButtons;
