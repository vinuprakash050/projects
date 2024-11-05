import React from 'react';
import mainBanner from './main_banner.jpg'; // Ensure you import the image

function Main() {
  return (
    <main className="main-content">
      <div className="image-container">
        <img src={mainBanner} alt="Description" className="main-image" />
        <div className="content-overlay">
          <div className="content-image">
            <p>Be authentic.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Main;
