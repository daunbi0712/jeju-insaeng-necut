// Google Apps Script 웹 앱(백엔드)과 통신하는 얇은 클라이언트.
// VITE_APPS_SCRIPT_URL이 설정되지 않으면 조용히 아무것도 하지 않는다(로컬 개발 편의).

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

export const isBackendConfigured = Boolean(APPS_SCRIPT_URL)

// Apps Script doPost는 JSON Content-Type의 preflight(OPTIONS)를 처리하지 못하므로
// text/plain으로 보내고 서버에서 JSON.parse 한다.
export async function logPhotoEvent() {
  if (!isBackendConfigured) return null
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ event: 'photo_taken', at: new Date().toISOString() }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('백엔드 기록 실패(무시하고 계속 진행):', err)
    return null
  }
}

export async function fetchStats() {
  if (!isBackendConfigured) return null
  try {
    const res = await fetch(APPS_SCRIPT_URL)
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.warn('통계 조회 실패:', err)
    return null
  }
}
