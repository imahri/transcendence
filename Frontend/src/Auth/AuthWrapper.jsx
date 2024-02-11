import React from 'react';
import './AuthWrapper.css';

function AuthWrapper(props) {

    const Component = props.component;
  return (
    <>
    <div className="login-container">
      <div className="rigth-container">
        <div className="form-container">
            <Component/>
      </div>
    </div>
    </div>
  </>
  );
}

export default AuthWrapper