// this is the component that will be used to display all videos
// It will use the react <videos> tag to display the video

import React from 'react';
import styles from './video.module.css';

export default function Video({ video }) {
  return (
    // align the video to the center of the page
    <div className = {styles.video}>
        <video width="560" height="315" controls src={video.src} />
        <div className={styles.title}>{video.title}</div>
    </div >
  );
}
