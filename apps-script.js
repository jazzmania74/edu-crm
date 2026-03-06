/**
 * ============================================================
 * 교육CRM 영업기회 관리기 - Google Apps Script Backend
 * ============================================================
 *
 * [설정 방법]
 * 1. 구글 시트를 열고, 확장 프로그램 > Apps Script 클릭
 * 2. 기존 코드를 모두 삭제하고, 이 파일의 내용을 붙여넣기
 * 3. 저장 (Ctrl+S)
 * 4. 배포 > 새 배포 클릭
 * 5. 유형: 웹 앱 선택
 * 6. 실행할 사용자: 본인
 * 7. 액세스 권한: 모든 사용자
 * 8. 배포 클릭 → 권한 승인
 * 9. 생성된 URL을 복사하여 웹앱 설정에 붙여넣기
 *
 * [주의] 코드를 수정한 경우, 새 배포를 만들어야 변경사항이 반영됩니다.
 */

const SHEET_GID = 970813333;

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === SHEET_GID) {
      return sheets[i];
    }
  }
  return sheets[0];
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

// GET 요청 처리 - 데이터 조회
function doGet(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        let val = data[i][j];
        // Date 객체를 문자열로 변환
        if (val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss");
        }
        obj[headers[j]] = val;
      }
      rows.push(obj);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: rows,
      headers: headers,
      totalRows: rows.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// POST 요청 처리 - 데이터 추가/수정/삭제
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const sheet = getSheet();
    const headers = getHeaders(sheet);

    let result = {};

    switch (action) {
      case 'add':
        result = addRow(sheet, headers, body.data);
        break;
      case 'update':
        result = updateRow(sheet, headers, body.data);
        break;
      case 'delete':
        result = deleteRow(sheet, headers, body.id);
        break;
      case 'updateStage':
        result = updateStage(sheet, headers, body.id, body.stageId, body.stageDate);
        break;
      case 'searchContacts':
        result = searchContacts(body.query);
        break;
      case 'createCalendarEvent':
        result = createCalendarEvent(body.data);
        break;
      default:
        result = { success: false, error: '알 수 없는 action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 새 행 추가
function addRow(sheet, headers, data) {
  const newRow = headers.map(function(h) {
    return data[h] !== undefined ? data[h] : '';
  });
  sheet.appendRow(newRow);
  return { success: true, action: 'add', id: data.id };
}

// 기존 행 수정
function updateRow(sheet, headers, data) {
  const idCol = headers.indexOf('id');
  if (idCol === -1) return { success: false, error: 'id 컬럼을 찾을 수 없습니다.' };

  const allData = sheet.getDataRange().getValues();
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(data.id)) {
      for (let j = 0; j < headers.length; j++) {
        if (data[headers[j]] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(data[headers[j]]);
        }
      }
      return { success: true, action: 'update', id: data.id };
    }
  }
  return { success: false, error: 'ID를 찾을 수 없습니다: ' + data.id };
}

// 행 삭제
function deleteRow(sheet, headers, id) {
  const idCol = headers.indexOf('id');
  if (idCol === -1) return { success: false, error: 'id 컬럼을 찾을 수 없습니다.' };

  const allData = sheet.getDataRange().getValues();
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true, action: 'delete', id: id };
    }
  }
  return { success: false, error: 'ID를 찾을 수 없습니다: ' + id };
}

// 단계만 업데이트
function updateStage(sheet, headers, id, stageId, stageDate) {
  const idCol = headers.indexOf('id');
  const stageCol = headers.indexOf('stageId');
  const stageDateCol = headers.indexOf('stageDate');
  const updatedCol = headers.indexOf('updatedAt');

  if (idCol === -1 || stageCol === -1) {
    return { success: false, error: '필수 컬럼을 찾을 수 없습니다.' };
  }

  const allData = sheet.getDataRange().getValues();
  for (let i = 1; i < allData.length; i++) {
    if (String(allData[i][idCol]) === String(id)) {
      sheet.getRange(i + 1, stageCol + 1).setValue(stageId);
      if (stageDateCol !== -1) {
        sheet.getRange(i + 1, stageDateCol + 1).setValue(stageDate);
      }
      if (updatedCol !== -1) {
        sheet.getRange(i + 1, updatedCol + 1).setValue(new Date().toISOString());
      }
      return { success: true, action: 'updateStage', id: id, stageId: stageId };
    }
  }
  return { success: false, error: 'ID를 찾을 수 없습니다: ' + id };
}

// 구글 주소록 검색 (People API)
function searchContacts(query) {
  try {
    const people = People.People.searchContacts({
      query: query,
      readMask: 'names,emailAddresses,phoneNumbers,organizations',
      pageSize: 10
    });

    const results = (people.results || []).map(function(r) {
      const p = r.person || {};
      return {
        name: (p.names && p.names[0]) ? p.names[0].displayName : '',
        org: (p.organizations && p.organizations[0]) ? p.organizations[0].name : '',
        phone: (p.phoneNumbers && p.phoneNumbers[0]) ? p.phoneNumbers[0].value : '',
        email: (p.emailAddresses && p.emailAddresses[0]) ? p.emailAddresses[0].value : ''
      };
    });

    return { success: true, action: 'searchContacts', data: results, count: results.length };
  } catch (error) {
    return { success: false, error: '주소록 검색 오류: ' + error.message };
  }
}

// 구글 캘린더 일정 생성
function createCalendarEvent(data) {
  try {
    var cal = CalendarApp.getDefaultCalendar();
    var title = data.title || '';
    var description = data.description || '';
    var dateStr = data.date || '';
    var startTime = data.startTime || '';
    var hours = Number(data.hours) || 1;

    if (!dateStr) {
      return { success: false, error: '교육일자를 입력하세요.' };
    }

    // 날짜 파싱 (YYYY-MM-DD)
    var parts = dateStr.split('-');
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]) - 1;
    var day = parseInt(parts[2]);

    var startDate;
    if (startTime) {
      var timeParts = startTime.split(':');
      startDate = new Date(year, month, day, parseInt(timeParts[0]), parseInt(timeParts[1]));
    } else {
      startDate = new Date(year, month, day, 9, 0);
    }

    var endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);

    var event = cal.createEvent(title, startDate, endDate, {
      description: description
    });

    return {
      success: true,
      action: 'createCalendarEvent',
      eventId: event.getId(),
      message: '구글 캘린더에 일정이 저장되었습니다.'
    };
  } catch (error) {
    return { success: false, error: '캘린더 저장 오류: ' + error.message };
  }
}
