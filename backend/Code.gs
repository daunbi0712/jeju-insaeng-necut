// 제주 인생네컷 - 방문/촬영 통계 백엔드 (Google Apps Script)
// 배포 방법은 backend/README.md 참고.
//
// 이 스크립트가 바인딩된 Google Sheet에 "Log" 시트를 만들고,
// 촬영이 끝날 때마다 프론트엔드가 POST로 기록을 남기고,
// 화면에는 GET으로 누적/오늘 통계를 보여준다.

const SHEET_NAME = 'Log'

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME)
    sheet.appendRow(['Timestamp', 'Event', 'UserAgent'])
  }
  return sheet
}

function countToday_(sheet) {
  const values = sheet.getDataRange().getValues()
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  let count = 0
  for (let i = 1; i < values.length; i++) {
    const ts = new Date(values[i][0])
    if (ts >= startOfToday) count++
  }
  return count
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}

// 촬영 이벤트 기록: 프론트엔드에서 4컷 완성 시 호출
function doPost(e) {
  const sheet = getSheet_()
  let body = {}
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    body = {}
  }
  sheet.appendRow([new Date(), body.event || 'photo_taken', body.userAgent || ''])
  const total = Math.max(sheet.getLastRow() - 1, 0)
  const today = countToday_(sheet)
  return jsonOutput_({ ok: true, total, today })
}

// 통계 조회: 프론트엔드가 화면에 누적/오늘 통계를 보여줄 때 호출
function doGet(e) {
  const sheet = getSheet_()
  const total = Math.max(sheet.getLastRow() - 1, 0)
  const today = countToday_(sheet)
  return jsonOutput_({ total, today })
}
