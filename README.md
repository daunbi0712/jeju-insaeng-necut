# 제주 인생네컷

노트북 웹캠으로 찍는 4컷 인생네컷 웹앱. 제주 컨셉 프레임(돌하르방·야자수·감귤·파도)이
자동으로 합성되며, 촬영 통계는 Google Sheets + Apps Script 백엔드에 기록됩니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 안내된 주소(기본 http://localhost:5173)로 접속 후 카메라 권한을 허용하세요.

## 백엔드(통계) 연결 (선택)

기본값으로는 백엔드 없이도 촬영/다운로드가 전부 동작합니다. 방문자/촬영 통계를
기록하고 싶다면 [`backend/README.md`](./backend/README.md)를 따라 Google Apps Script를
배포한 뒤, 발급된 URL을 `.env`의 `VITE_APPS_SCRIPT_URL`에 넣어주세요.

```bash
cp .env.example .env
# .env를 열어 VITE_APPS_SCRIPT_URL 값을 배포한 웹앱 URL로 교체
```

## 구조

```
src/
  App.jsx          # 촬영 플로우 (카메라 → 4컷 카운트다운 → 합성 → 다운로드)
  lib/jejuFrame.js # 제주 컨셉 프레임을 canvas로 그리는 로직
  lib/api.js       # Apps Script 백엔드 호출
backend/
  Code.gs          # Apps Script 소스 (Google Sheets에 붙여넣어 배포)
  README.md        # 백엔드 배포 가이드
```
