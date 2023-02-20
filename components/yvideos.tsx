// video component for youtube videos

import React from 'react';
import styles from './video.module.css';

export default function Yvideo({ video }) {
    return (
        <div className={styles.video}>
        <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${video.src}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
        <div className={styles.title}>{video.title}</div>
        </div>
    );
    }