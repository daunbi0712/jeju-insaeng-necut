import { useEffect, useRef, useState, useCallback } from 'react'
import { drawJejuFrame, FRAME_WIDTH, FRAME_HEIGHT } from './lib/jejuFrame'
import { logPhotoEvent, fetchStats, isBackendConfigured } from './lib/api'

const SHOT_COUNT = 4
const COUNTDOWN_FROM = 3

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatDate(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

export default function App() {
  const videoRef = useRef(null)
  const frameCanvasRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraState, setCameraState] = useState('idle') // idle | starting | live | error
  const [cameraError, setCameraError] = useState('')
  const [phase, setPhase] = useState('ready') // ready | countdown | flash | review
  const [countdown, setCountdown] = useState(null)
  const [shotsTaken, setShotsTaken] = useState([]) // canvas snapshots
  const [resultUrl, setResultUrl] = useState(null)
  const [stats, setStats] = useState(null)
  const [busy, setBusy] = useState(false)

  const startCamera = useCallback(async () => {
    setCameraState('starting')
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraState('live')
    } catch (err) {
      console.error(err)
      setCameraError(
        err?.name === 'NotAllowedError'
          ? '카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 접근을 허용해주세요.'
          : '카메라를 시작할 수 없습니다. 다른 프로그램이 카메라를 사용 중인지 확인해주세요.',
      )
      setCameraState('error')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startCamera])

  useEffect(() => {
    fetchStats().then((s) => s && setStats(s))
  }, [])

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    const w = video.videoWidth
    const h = video.videoHeight
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    // 미리보기가 좌우 반전이므로 캡처도 동일하게 반전해 저장한다.
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, w, h)
    return canvas
  }, [])

  const runCaptureSequence = useCallback(async () => {
    if (cameraState !== 'live' || busy) return
    setBusy(true)
    setResultUrl(null)
    const captured = []
    setShotsTaken([])

    for (let i = 0; i < SHOT_COUNT; i++) {
      setPhase('countdown')
      for (let c = COUNTDOWN_FROM; c > 0; c--) {
        setCountdown(c)
        await wait(800)
      }
      setCountdown(null)
      setPhase('flash')
      const canvas = captureFrame()
      captured.push(canvas)
      setShotsTaken([...captured])
      await wait(350)
    }

    const finalCanvas = frameCanvasRef.current
    drawJejuFrame(finalCanvas, captured, formatDate(new Date()))
    setResultUrl(finalCanvas.toDataURL('image/png'))
    setPhase('review')
    setBusy(false)

    logPhotoEvent().then((res) => {
      if (res) setStats(res)
      else fetchStats().then((s) => s && setStats(s))
    })
  }, [cameraState, busy, captureFrame])

  const retake = () => {
    setPhase('ready')
    setResultUrl(null)
    setShotsTaken([])
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>🍊 제주 인생네컷</h1>
        <p>노트북 카메라로 찍는 4컷 사진, 제주 컨셉 프레임</p>
      </header>

      <main className="stage">
        {phase !== 'review' && (
          <div className="camera-wrap">
            <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
            {cameraState === 'error' && (
              <div className="camera-overlay">
                <p>{cameraError}</p>
                <button onClick={startCamera}>다시 시도</button>
              </div>
            )}
            {cameraState === 'starting' && (
              <div className="camera-overlay">
                <p>카메라를 켜는 중...</p>
              </div>
            )}
            {phase === 'countdown' && countdown && (
              <div className="countdown-overlay">
                <span className="countdown-number">{countdown}</span>
              </div>
            )}
            {phase === 'flash' && <div className="flash-overlay" />}

            <div className="shot-progress">
              {Array.from({ length: SHOT_COUNT }).map((_, i) => (
                <div key={i} className={`shot-dot ${shotsTaken[i] ? 'filled' : ''}`} />
              ))}
            </div>
          </div>
        )}

        {phase === 'ready' && (
          <button
            className="primary-btn"
            disabled={cameraState !== 'live' || busy}
            onClick={runCaptureSequence}
          >
            촬영 시작 (4컷)
          </button>
        )}


        {phase === 'countdown' || phase === 'flash' ? (
          <p className="hint">
            {shotsTaken.length + 1}/{SHOT_COUNT}번째 컷 준비 중... 카메라를 봐주세요!
          </p>
        ) : null}

        {phase === 'review' && resultUrl && (
          <div className="review">
            <img className="result-image" src={resultUrl} alt="제주 인생네컷 결과" />
            <div className="review-actions">
              <a className="primary-btn" href={resultUrl} download="jeju-insaengnecut.png">
                다운로드
              </a>
              <button className="secondary-btn" onClick={retake}>
                다시 찍기
              </button>
            </div>
          </div>
        )}

        <canvas
          ref={frameCanvasRef}
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          style={{ display: 'none' }}
        />
      </main>

      <footer className="footer">
        {isBackendConfigured ? (
          stats ? (
            <p>누적 촬영 {stats.total ?? '-'}회 · 오늘 {stats.today ?? '-'}회</p>
          ) : (
            <p>통계 불러오는 중...</p>
          )
        ) : (
          <p className="backend-note">
            백엔드 미연결 — .env에 VITE_APPS_SCRIPT_URL을 설정하면 방문 통계가 기록됩니다.
          </p>
        )}
      </footer>
    </div>
  )
}
