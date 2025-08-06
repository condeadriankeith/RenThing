import React from 'react';
import gsap from 'gsap';

const HomePage = () => {
  React.useEffect(() => {
    gsap.from('.listing-card', {
      y: 32,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power2.out',
    });
    gsap.from('.fab', {
      scale: 0.7,
      opacity: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.6)',
      delay: 0.3,
    });
  }, []);

  return (
    <div>
      <div className="listing-card">Card 1</div>
      <div className="listing-card">Card 2</div>
      <div className="listing-card">Card 3</div>
      <div className="fab">FAB</div>
    </div>
  );
};

export default HomePage;