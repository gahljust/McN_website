import styles from './video.module.css';

export default function Video({ video }: { video: { src: string; title: string } }) {
  return (
    <figure className={styles.video}>
      <video controls preload="metadata" src={video.src} aria-label={video.title} />
      <figcaption className={styles.title}>{video.title}</figcaption>
    </figure>
  );
}
