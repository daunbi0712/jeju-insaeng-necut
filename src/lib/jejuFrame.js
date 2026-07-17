// 제주 컨셉 인생네컷 프레임을 캔버스에 그리는 유틸리티.
// 외부 이미지 리소스 없이 canvas 도형만으로 돌하르방/야자수/파도/감귤을 그린다.

export const FRAME_WIDTH = 760
export const PHOTO_W = 340
export const PHOTO_H = 255
const GAP = 16
const OUTER_MARGIN = 32
const HEADER_H = 150
const FOOTER_H = 150
const SECTION_GAP = 20

export const FRAME_HEIGHT =
  OUTER_MARGIN * 2 + HEADER_H + SECTION_GAP + PHOTO_H * 2 + GAP + SECTION_GAP + FOOTER_H

const COLORS = {
  cream: '#FFF8EC',
  sea: '#1FA2B5',
  seaLight: '#8FD9E4',
  sand: '#F4C77B',
  tangerine: '#FF8A3D',
  tangerineDark: '#E8672A',
  leaf: '#4C9A5A',
  stone: '#8C8378',
  stoneDark: '#5F584E',
  ink: '#2E2A25',
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawTangerine(ctx, x, y, r) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = COLORS.tangerine
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = COLORS.tangerineDark
  ctx.lineWidth = Math.max(1, r * 0.06)
  ctx.stroke()
  // leaf
  ctx.fillStyle = COLORS.leaf
  ctx.beginPath()
  ctx.ellipse(-r * 0.1, -r * 1.05, r * 0.45, r * 0.22, -0.6, 0, Math.PI * 2)
  ctx.fill()
  // stem
  ctx.strokeStyle = COLORS.leaf
  ctx.lineWidth = Math.max(1, r * 0.12)
  ctx.beginPath()
  ctx.moveTo(0, -r * 0.95)
  ctx.lineTo(0, -r * 1.15)
  ctx.stroke()
  ctx.restore()
}

function drawSun(ctx, x, y, r) {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = '#FFD66B'
  for (let i = 0; i < 8; i++) {
    ctx.save()
    ctx.rotate((i * Math.PI) / 4)
    ctx.beginPath()
    ctx.ellipse(0, -r * 1.55, r * 0.16, r * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawWaveStrip(ctx, x, y, w, amplitude, color) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  const waves = Math.round(w / 40)
  ctx.beginPath()
  for (let i = 0; i <= waves; i++) {
    const px = x + (i * w) / waves
    const py = y + (i % 2 === 0 ? -amplitude : amplitude)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.quadraticCurveTo(x + ((i - 0.5) * w) / waves, y, px, py)
  }
  ctx.stroke()
  ctx.restore()
}

function drawPalmTree(ctx, x, y, scale) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  // trunk
  ctx.strokeStyle = '#A4703A'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(-6, -30, 4, -60)
  ctx.stroke()
  // leaves
  ctx.fillStyle = COLORS.leaf
  const leafAngles = [-1.9, -1.3, -0.7, 0, 0.6]
  leafAngles.forEach((a) => {
    ctx.save()
    ctx.translate(4, -60)
    ctx.rotate(a)
    ctx.beginPath()
    ctx.ellipse(18, 0, 22, 7, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })
  ctx.restore()
}

function drawDolHareubang(ctx, x, y, scale) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.fillStyle = COLORS.stone
  ctx.strokeStyle = COLORS.stoneDark
  ctx.lineWidth = 2.5
  // hat
  roundRectPath(ctx, -26, -66, 52, 16, 6)
  ctx.fill()
  ctx.stroke()
  // head/body
  ctx.beginPath()
  ctx.moveTo(-22, -50)
  ctx.quadraticCurveTo(-30, 10, -20, 40)
  ctx.lineTo(20, 40)
  ctx.quadraticCurveTo(30, 10, 22, -50)
  ctx.quadraticCurveTo(0, -60, -22, -50)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // eyes
  ctx.fillStyle = COLORS.stoneDark
  ctx.beginPath()
  ctx.ellipse(-9, -32, 5, 6, 0, 0, Math.PI * 2)
  ctx.ellipse(9, -32, 5, 6, 0, 0, Math.PI * 2)
  ctx.fill()
  // hands
  ctx.beginPath()
  ctx.ellipse(-14, 8, 6, 10, 0.3, 0, Math.PI * 2)
  ctx.ellipse(14, 8, 6, 10, -0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

function drawBackground(ctx, w, h) {
  ctx.fillStyle = COLORS.cream
  roundRectPath(ctx, 0, 0, w, h, 28)
  ctx.fill()

  ctx.save()
  roundRectPath(ctx, 0, 0, w, h, 28)
  ctx.clip()

  const grad = ctx.createLinearGradient(0, 0, 0, HEADER_H)
  grad.addColorStop(0, COLORS.seaLight)
  grad.addColorStop(1, COLORS.cream)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, HEADER_H + 40)

  drawSun(ctx, w - 70, 55, 22)
  drawWaveStrip(ctx, 0, HEADER_H - 6, w, 6, COLORS.sea)

  const footerY = h - FOOTER_H
  const grad2 = ctx.createLinearGradient(0, footerY, 0, h)
  grad2.addColorStop(0, COLORS.cream)
  grad2.addColorStop(1, COLORS.seaLight)
  ctx.fillStyle = grad2
  ctx.fillRect(0, footerY - 30, w, FOOTER_H + 30)
  drawWaveStrip(ctx, 0, footerY + 14, w, 6, COLORS.sea)

  ctx.restore()

  ctx.save()
  roundRectPath(ctx, 6, 6, w - 12, h - 12, 24)
  ctx.strokeStyle = COLORS.tangerine
  ctx.lineWidth = 4
  ctx.setLineDash([12, 8])
  ctx.stroke()
  ctx.restore()
}

function drawHeaderText(ctx, w) {
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.ink
  ctx.font = "bold 40px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
  ctx.fillText('제주 인생네컷', w / 2, 78)
  ctx.font = "600 16px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
  ctx.fillStyle = COLORS.sea
  ctx.letterSpacing = '4px'
  ctx.fillText('J E J U   P H O T O', w / 2, 106)
  ctx.restore()

  drawTangerine(ctx, 56, 60, 22)
  drawDolHareubang(ctx, w - 56, 90, 0.6)
}

function drawFooterDecor(ctx, w, h, dateStr) {
  const footerY = h - FOOTER_H
  drawPalmTree(ctx, 54, h - 26, 0.9)
  drawTangerine(ctx, w - 60, h - 60, 16)
  drawTangerine(ctx, w - 38, h - 42, 12)

  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.ink
  ctx.font = "bold 22px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
  ctx.fillText('Life Four Cut in Jeju', w / 2, footerY + 58)
  ctx.font = "500 15px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
  ctx.fillStyle = COLORS.stoneDark
  ctx.fillText(dateStr, w / 2, footerY + 84)
  ctx.restore()
}

function drawImageCover(ctx, source, sx, sy, sw, sh) {
  const srcW = source.videoWidth || source.width
  const srcH = source.videoHeight || source.height
  const srcRatio = srcW / srcH
  const dstRatio = sw / sh
  let cropW = srcW
  let cropH = srcH
  let cropX = 0
  let cropY = 0
  if (srcRatio > dstRatio) {
    cropW = srcH * dstRatio
    cropX = (srcW - cropW) / 2
  } else {
    cropH = srcW / dstRatio
    cropY = (srcH - cropH) / 2
  }
  ctx.drawImage(source, cropX, cropY, cropW, cropH, sx, sy, sw, sh)
}

function photoSlotRects() {
  const gridTop = OUTER_MARGIN + HEADER_H + SECTION_GAP
  const leftX = OUTER_MARGIN
  const rightX = OUTER_MARGIN + PHOTO_W + GAP
  const topY = gridTop
  const bottomY = gridTop + PHOTO_H + GAP
  return [
    { x: leftX, y: topY, w: PHOTO_W, h: PHOTO_H },
    { x: rightX, y: topY, w: PHOTO_W, h: PHOTO_H },
    { x: leftX, y: bottomY, w: PHOTO_W, h: PHOTO_H },
    { x: rightX, y: bottomY, w: PHOTO_W, h: PHOTO_H },
  ]
}

export function drawJejuFrame(canvas, photoSources, dateStr) {
  canvas.width = FRAME_WIDTH
  canvas.height = FRAME_HEIGHT
  const ctx = canvas.getContext('2d')

  drawBackground(ctx, FRAME_WIDTH, FRAME_HEIGHT)
  drawHeaderText(ctx, FRAME_WIDTH)

  const slots = photoSlotRects()
  slots.forEach((slot, i) => {
    const source = photoSources[i]
    if (!source) return
    ctx.save()
    roundRectPath(ctx, slot.x, slot.y, slot.w, slot.h, 10)
    ctx.clip()
    drawImageCover(ctx, source, slot.x, slot.y, slot.w, slot.h)
    ctx.restore()
    ctx.save()
    roundRectPath(ctx, slot.x, slot.y, slot.w, slot.h, 10)
    ctx.lineWidth = 4
    ctx.strokeStyle = '#FFFFFF'
    ctx.stroke()
    ctx.restore()
  })

  drawFooterDecor(ctx, FRAME_WIDTH, FRAME_HEIGHT, dateStr)
  return canvas
}
