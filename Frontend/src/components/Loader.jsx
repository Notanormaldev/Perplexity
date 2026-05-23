import React from 'react';

const Loader = ({ show = true }) => {
  if (!show) return null;

  return (
    <>
      <style>
        {`
          .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          .loader { 
            position: relative; 
            width: 64px; 
            height: 64px; 
            border-radius: 50%; 
            perspective: 800px; 
          }
          .inner { 
            position: absolute; 
            box-sizing: border-box; 
            width: 100%; 
            height: 100%; 
            border-radius: 50%; 
          }
          .inner.one { 
            left: 0%; 
            top: 0%; 
            animation: rotate-one 1s linear infinite; 
            border-bottom: 3px solid #EFEFFA; 
          }
          .inner.two { 
            right: 0%; 
            top: 0%; 
            animation: rotate-two 1s linear infinite; 
            border-right: 3px solid #EFEFFA; 
          }
          .inner.three { 
            right: 0%; 
            bottom: 0%; 
            animation: rotate-three 1s linear infinite; 
            border-top: 3px solid #EFEFFA; 
          }
          @keyframes rotate-one { 
            0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); } 
            100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); } 
          }
          @keyframes rotate-two { 
            0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); } 
            100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); } 
          }
          @keyframes rotate-three { 
            0% { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg); } 
            100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); } 
          }
        `}
      </style>
      <div className="loader-overlay">
        <div className="loader">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
