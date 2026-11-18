import styles from './video.module.css';

type VideoSource = { src: string; title: string; poster?: string; credit?: string };

export default function Video({ video }: { video: VideoSource }) {
  return (
    <figure className={styles.video}>
      <video controls playsInline preload="metadata" src={video.src} poster={video.poster} aria-label={video.title} />
      <figcaption className={styles.title}>
        {video.title}
        {video.credit ? <span className={styles.credit}>{video.credit}</span> : null}
      </figcaption>
    </figure>
  );
}
