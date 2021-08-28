import React, { useEffect, useState } from 'react';

function Temp() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('we are in useeffect');
    return () => {
      document.addEventListener('click', () => {
        console.log('event');
      });
    };
  }, []);

  console.log('render');
  return (
    <div>
      <h1>The count is : {count}</h1>
      <button
        onClick={() => {
          setCount(count + 1);
        }}>
        Add Me!
      </button>
    </div>
  );
}

export default Temp;
