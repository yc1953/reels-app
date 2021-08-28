import React, { useEffect } from 'react';

const IntersectionDemo = () => {
  function callback(entries) {
    entries.forEach((entry) => {
      console.log('called');
      let child = entry.target.firstElementChild;
      child.play().then(() => {
        if (entry.isIntersecting === false) {
          child.pause();
        }
      });
      //   console.log(child.id);
    });
  }

  useEffect(() => {
    let conditionObj = {
      root: null,
      threshold: 0.9,
    };

    let observer = new IntersectionObserver(callback, conditionObj);
    let allVideoElements = document.querySelectorAll('.video-element');
    allVideoElements.forEach((video) => {
      observer.observe(video);
    });
  }, []);

  return (
    <div>
      <div className='video-element'>
        <Video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" id='a' />
      </div>
      <div className='video-element'>
        <Video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" id='b' />
      </div>
      <div className='video-element'>
        <Video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" id='c' />
      </div>
      <div className='video-element'>
        <Video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" id='d' />
      </div>
    </div>
  );
};

function Video(props) {
  return <video width='800px' muted={true} controls src={props.src}></video>;
}

export default IntersectionDemo;
