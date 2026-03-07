================================================================
  교육CRM 영업기회 관리기 (Education CRM)
  나눔경영컨설팅
================================================================

[프로젝트 개요]
기업교육 영업기회를 체계적으로 관리하기 위한 웹 기반 CRM 시스템입니다.
Google Sheets를 데이터베이스로 활용하며, Google Apps Script를 백엔드로 사용합니다.

[주요 기능]
- 영업기회 등록/수정/삭제/복제
- 파이프라인 단계 관리 (교육문의 > 커리큘럼제안 > 견적 > 계약 등)
- 단계별 필터링 (전체/진행중/실패/전달/계약성공)
- 검색 기능 (회사명, 담당자, 교육과정, 강사, 등록자, 협업강사 등)
- 구글 주소록 연동 검색 (People API)
- 구글 캘린더 일정 자동 생성
- 아임웹 위젯 연동 (iframe 임베딩)

[영업 파이프라인 단계]
1. 교육문의       - 교육 관련 최초 문의 접수
2. 커리큘럼제안   - 교육 커리큘럼/제안서 발송
3. 1차견적        - 첫 번째 견적 발송
4. 2차견적        - 수정 견적 발송
5. 계약실패(연기) - 계약 불발 또는 연기
6. 계약거절(전달) - 타 강사/기관으로 전달
7. 계약성공       - 계약 체결 완료
8. 입금완료       - 교육비 입금 확인

[파일 구성]
- index.html        : 메인 웹앱 (프론트엔드 전체, HTML/CSS/JS 단일 파일)
- apps-script.js    : Google Apps Script 백엔드 코드
- widget.html       : 아임웹 HTML 위젯용 iframe 임베딩 코드
- .gitignore        : Git 추적 제외 설정 (.gsheet 파일 등)
- 00.기업교육 영업기회 DB(중요 삭제금지).gsheet : 데이터 저장용 구글 시트 (Git 추적 제외)

[기술 스택]
- 프론트엔드: HTML5, CSS3 (커스텀 속성), Vanilla JavaScript
- 백엔드: Google Apps Script (웹 앱 배포)
- 데이터베이스: Google Sheets
- 외부 연동: Google People API (주소록), Google Calendar API
- 폰트: Noto Sans KR (Google Fonts)
- 호스팅: GitHub Pages (jazzmania74.github.io/edu-crm)
- 임베딩: 아임웹 HTML 위젯 (iframe)

[개발 환경 및 배포]
- 소스 코드: Google Drive (01.나눔경영컨설팅 웹앱(코딩)★/01_edu-crm/)
- Git 저장소: Google Drive 폴더에서 직접 Git 관리
- GitHub: jazzmania74/edu-crm (main 브랜치)
- 배포 URL: https://jazzmania74.github.io/edu-crm/index.html
- 수정 후 배포: git add → git commit → git push origin main → GitHub Pages 자동 반영

[연동 정보]
- 구글 시트 ID: 12PJJ4Mbp12k7I8aOQdobA54SnWTy_PI_z0r0iLp-Iyo
- 시트 GID (탭 ID): 970813333
- Apps Script URL: https://script.google.com/macros/s/AKfycbyHi97vkrsF6-vRy7azyXrMJChlLmnUW0H0kKB0_f7C_2fSQ6GCLSBp1USpor2veygGXg/exec

[Apps Script 설정 방법]
1. 구글 시트를 열고, 확장 프로그램 > Apps Script 클릭
2. 기존 코드를 모두 삭제하고, apps-script.js 내용을 붙여넣기
3. 저장 (Ctrl+S)
4. 배포 > 새 배포 클릭
5. 유형: 웹 앱 선택
6. 실행할 사용자: 본인
7. 액세스 권한: 모든 사용자 (중요! "나만"으로 하면 외부 접근 불가)
8. 배포 클릭 후 권한 승인
9. 생성된 URL을 복사하여 웹앱의 연동 설정에 붙여넣기

[관리 데이터 항목]
- 기본 정보: 회사명, 담당자, 연락처, 이메일
- 교육 정보: 교육과정, 제목, 강사, 교육일자, 시작시간, 교육시간
- 매출 정보: 매출액, 매출유형, 강사료, 수수료
- 기타 정보: 등록자, 비고

[주의사항]
- apps-script.js 코드를 수정한 경우, 새 배포를 만들어야 변경사항이 반영됩니다
- 구글 시트 파일(00.기업교육 영업기회 DB)은 중요 데이터이므로 삭제하지 마세요
- .gsheet 파일은 .gitignore로 Git 추적에서 제외되어 있습니다
- People API 사용을 위해 Apps Script에서 해당 서비스를 활성화해야 합니다
- Google Drive에서 Git 사용 시, 여러 기기에서 동시 편집하면 .git 충돌이 발생할 수 있으므로 주의

================================================================
