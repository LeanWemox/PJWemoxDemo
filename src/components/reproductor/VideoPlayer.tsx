import {
  useEffect,
  useRef,
  type ReactElement,
  type SyntheticEvent,
} from 'react'
import { useAppStore } from '../../state/appStore'

interface VideoPlayerProps {
  url: string | null
  startTime?: number
  title?: string
}

function seekVideo(
  video: HTMLVideoElement,
  seconds: number,
): void {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return
  }

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    video.currentTime = seconds
  }
}

export function VideoPlayer({
  url,
  startTime,
  title = 'Reproductor de audiencia',
}: VideoPlayerProps): ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null)
  const storeStartTime = useAppStore((state) => state.startTime)
  const requestedStartTime = startTime ?? storeStartTime

  useEffect(() => {
    const video = videoRef.current

    if (video !== null) {
      seekVideo(video, requestedStartTime)
    }
  }, [requestedStartTime, url])

  const handleLoadedMetadata = (
    event: SyntheticEvent<HTMLVideoElement>,
  ): void => {
    seekVideo(event.currentTarget, requestedStartTime)
  }

  if (url === null || url === '') {
    return <p className="status-message" role="status">Video no disponible.</p>
  }

  if (url.includes('/_layouts/15/embed.aspx')) {
    return (
      <iframe
        aria-label={title}
        className="video-player video-player--embed"
        src={url}
        title={title}
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
      />
    )
  }

  return (
    <video
      aria-label={title}
      className="video-player"
      controls
      key={url}
      onLoadedMetadata={handleLoadedMetadata}
      ref={videoRef}
      src={url}
    >
      Tu navegador no admite la reproducción de video.
    </video>
  )
}
