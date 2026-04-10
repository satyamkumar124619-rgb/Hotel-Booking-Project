// GalleryPage.jsx
import React from 'react';
import Gallery from '../components/Gallery';

// Gallery already renders its own full-page dark layout,
// so the wrapper just needs a matching background.
const GalleryPage = () => {
  return (
    <div style={{ background: '#0E0F0D', minHeight: '100vh' }}>
      <Gallery />
    </div>
  );
};

export default GalleryPage;