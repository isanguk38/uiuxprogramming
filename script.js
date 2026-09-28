// 1. 변하지 않는 값은 const로 저장합니다.
const panelTitle = "알림 설정";

// 2. 저장 전후로 바뀌는 상태는 let으로 저장합니다.
let isSaved = false;

// 3. JavaScript가 바꿀 요소를 id로 찾습니다.
const saveMessage = document.querySelector("#saveMessage");
const saveButton = document.querySelector("#saveButton");

// 4. 상태에 맞는 문구를 반환합니다.
function makeSaveMessage(saved) {
  if (saved === true) {
    return "알림 설정이 저장되었습니다.";
  }
  return "알림 설정을 저장해 주세요.";
}

// 5. 클릭 순간 실행할 동작입니다.
function saveSettings() {
  isSaved = true;
  saveMessage.textContent = makeSaveMessage(isSaved);
  saveMessage.classList.add("is-saved");
  saveButton.textContent = "저장됨";
  saveButton.disabled = true;
}

// 6. click 이벤트와 함수를 연결합니다.
saveButton.addEventListener("click", saveSettings);