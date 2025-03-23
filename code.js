// Code.gs - 예약 시스템 (상담 추가 정보 수집 포함)

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function submitReservation(grade, cls, day, time, studentName, parentName, contactInfo, notes) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("예약현황") || spreadsheet.insertSheet("예약현황");
  const closedSheet = spreadsheet.getSheetByName("마감현황") || spreadsheet.insertSheet("마감현황");

  const closedData = closedSheet.getDataRange().getValues();
  const isClosed = closedData.some(row =>
    String(row[0]) === String(grade) &&
    String(row[1]) === String(cls) &&
    String(row[2]) === String(day) &&
    String(row[3]) === String(time)
  );

  if (isClosed) {
    return "이미 마감된 시간입니다. 다른 시간대를 선택해주세요.";
  } else {
    const timestamp = new Date();
    sheet.appendRow([
      timestamp,
      String(grade),
      String(cls),
      String(day),
      String(time),
      studentName,
      parentName,
      contactInfo,
      notes
    ]);
    closedSheet.appendRow([String(grade), String(cls), String(day), String(time)]);
    return "상담 예약이 완료되었습니다.";
  }
}

function getAvailableTimes(grade, cls, day) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const closedSheet = spreadsheet.getSheetByName("마감현황") || spreadsheet.insertSheet("마감현황");

  const closedData = closedSheet.getDataRange().getValues();
  const reserved = closedData
    .filter(row =>
      String(row[0]) === String(grade) &&
      String(row[1]) === String(cls) &&
      String(row[2]) === String(day)
    )
    .map(row => String(row[3]));

  const allTimes = [
    "5시 30분 - 6시 20분",
    "6시 40분 - 7시 30분",
    "7시 50분 - 8시 40분"
  ];

  const available = allTimes.filter(t => !reserved.includes(t));
  return available;
}

function testAvailableTimes() {
  const grade = "2";
  const cls = "1";
  const day = "월요일";
  const available = getAvailableTimes(grade, cls, day);
  Logger.log("✅ 신청 가능한 시간 목록 for " + grade + "학년 " + cls + "반 " + day + ":");
  available.forEach(t => Logger.log("- " + t));
}
