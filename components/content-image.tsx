import Image, { type ImageProps } from 'next/image'
import imageData from '@/lib/generated/images.json'

const images = imageData as Record<string, { width: number; height: number }>
type Props = Omit<ImageProps, 'width' | 'height' | 'alt'> & { width?: number | string; height?: number | string; alt?: string }

function fallbackAlt(src: string) {
  const name = src.split('/').pop()?.replace(/\.[a-z0-9]+(?=\.)/gi, '').replace(/\.[^.]+$/, '') || 'Image'
  const match = src.match(/\/(root|g4|3dprint|webdev)\/[^/]*?(\d+)\./)
  if (match) {
    const labels: Record<string, string> = { root: 'ROOT', g4: 'Geant4', '3dprint': '3D printing', webdev: 'Website maintenance' }
    return `${labels[match[1]]} tutorial screenshot ${Number(match[2])}`
  }
  return name.replace(/[_-]/g, ' ')
}

export default function ContentImage({ src, width, height, alt, style, className, ...props }: Props) {
  const imported = typeof src === 'object' && 'default' in src ? src.default : src
  const url = typeof imported === 'string' ? imported : imported.src
  const known = images[url] || (typeof imported === 'object' ? imported : undefined)
  const imageWidth = known?.width || Number(width) || 600
  const imageHeight = known?.height || Number(height) || 400
  const description = alt && !/^(?:HeHelllooo y|i|Logo)$/i.test(alt) ? alt : fallbackAlt(url)
  return <Image {...props} src={src} alt={description} width={imageWidth} height={imageHeight}
    sizes="(max-width: 760px) 100vw, 760px" className={`content-image ${className || ''}`}
    style={{ width: '100%', maxWidth: Number(width) || imageWidth, height: 'auto', ...style }} />
}
