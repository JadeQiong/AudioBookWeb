// src/views/ShareTestView.tsx
import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import ReactGA from 'react-ga';

const ShareTestView: React.FC = () => {
  const shareUrl = 'https://booktalks.ai/';
  const title = 'Explore AI-Generated Book Blogs at BookTalks.ai';

  const handleShare = (platform: string) => {
    ReactGA.event({
      category: 'Social Share',
      action: `Shared on ${platform}`,
      label: shareUrl,
    });
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <FacebookShareButton
        url={shareUrl}
        title={title}
        onClick={() => handleShare('Facebook')}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={shareUrl}
        title={title}
        onClick={() => handleShare('Twitter')}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton
        url={shareUrl}
        title={title}
        onClick={() => handleShare('LinkedIn')}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      {/* Add more share buttons as needed */}
    </div>
  );
};

export default ShareTestView;
