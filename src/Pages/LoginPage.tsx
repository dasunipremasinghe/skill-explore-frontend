import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to Skill Explorer</h1>
      <GoogleLoginButton />
    </div>
  );
};

export default HomePage;
