import styles from './video.module.css';

export default function Yvideo({ video }: { video: { src: string; title: string } }) {
    return (
        <figure className={styles.video}>
        <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.src)}`}
            title={video.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
        <figcaption className={styles.title}>{video.title}</figcaption>
        </figure>
    );
    }
