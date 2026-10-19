

// 사전 신청: 저장 여부와 결과를 알림 설정과 같은 방식으로 바꿉니다.
const subscribeTitle = "사전 신청";
let isSubscribed = false;

const subscribeForm = document.querySelector("#subscribeForm");
const subscribeMessage = document.querySelector("#subscribeMessage");
const subscribeButton = document.querySelector("#subscribeButton");
const emailInput = document.querySelector("#email");

function makeSubscribeMessage(subscribed, email) {
  if (subscribed === true) {
    return email + "로 신청이 완료되었습니다.";
  }
  return "3월 정식 공개 전에 먼저 사용해 볼 수 있습니다.";
}

function submitSubscribe(event) {
  event.preventDefault();

  if (emailInput.checkValidity() === false) {
    emailInput.reportValidity();
    return;
  }

  const email = emailInput.value.trim();
  isSubscribed = true;
  subscribeMessage.textContent = makeSubscribeMessage(isSubscribed, email);
  subscribeMessage.classList.add("is-saved");
  subscribeButton.textContent = "신청 완료";
  subscribeButton.disabled = true;
  emailInput.disabled = true;
}

subscribeForm.addEventListener("submit", submitSubscribe);

const themeButton = document.querySelector("#themeButton");
const userNameInput = document.querySelector("#userName");
const userNameCount = document.querySelector("#userNameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
  const isDark = document.body.classList.toggle("dark");
  themeButton.textContent = isDark
    ? "밝은 테마로 바꾸기"
    : "어두운 테마로 바꾸기";
}

function handleUserNameInput() {
  const currentLength = userNameInput.value.length;
  userNameCount.textContent = currentLength + " / 10";
}

function handleAgreeChange() {
  const agreed = agreeCheck.checked;
  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed
    ? "확인이 완료되었습니다. 물어봇을 시작할 수 있습니다."
    : "안내 확인 후 물어봇을 시작할 수 있습니다.";
  agreeMessage.classList.toggle("is-ready", agreed);
}

themeButton.addEventListener("click", handleThemeClick);
userNameInput.addEventListener("input", handleUserNameInput);
agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", "false");
  });

  panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);
  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");
  targetPanel.classList.add("is-active");
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});

// 7주차 사용자 흐름: 안내 확인 → 질문 작성 → 분야 선택 → 내용 확인 → 접수 완료
const askFlow = document.querySelector("#askFlow");
const askSteps = document.querySelectorAll(".ask-step");
const askProgress = document.querySelector("#askProgress");
const askName = document.querySelector("#askName");
const askQuestion = document.querySelector("#askQuestion");
const askCategory = document.querySelector("#askCategory");
const askError1 = document.querySelector("#askError1");
const askError2 = document.querySelector("#askError2");
const askEtcHelp = document.querySelector("#askEtcHelp");
const summaryName = document.querySelector("#summaryName");
const summaryCategory = document.querySelector("#summaryCategory");
const summaryQuestion = document.querySelector("#summaryQuestion");
const askStepNames = ["질문 작성", "분야 선택", "내용 확인"];

function showAskStep(step) {
  askSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });
  askProgress.textContent = step <= 3
    ? step + " / 3 · " + askStepNames[step - 1]
    : "접수 완료";
}

function clearAskErrors() {
  askError1.textContent = "";
  askError2.textContent = "";
  askName.classList.remove("has-error");
  askQuestion.classList.remove("has-error");
  askCategory.classList.remove("has-error");
}

function handleStartClick() {
  // 6주차의 안내 확인 조건을 통과한 경우에만 흐름에 들어갑니다.
  if (agreeCheck.checked === false) {
    return;
  }
  askFlow.hidden = false;
  showAskStep(1);
  askFlow.scrollIntoView({ behavior: "smooth", block: "start" });
  askName.focus();
}

function handleAskNext1() {
  const missingName = askName.value.trim() === "";
  const missingQuestion = askQuestion.value.trim() === "";

  if (missingName || missingQuestion) {
    askError1.textContent = missingName
      ? "이름을 입력해 주세요."
      : "궁금한 점을 입력해 주세요.";
    askName.classList.toggle("has-error", missingName);
    askQuestion.classList.toggle("has-error", missingQuestion);
    (missingName ? askName : askQuestion).focus();
    return;
  }

  clearAskErrors();
  showAskStep(2);
  askCategory.focus();
}

function handleCategoryChange() {
  askEtcHelp.hidden = askCategory.value !== "기타";
  if (askCategory.value !== "") {
    askError2.textContent = "";
    askCategory.classList.remove("has-error");
  }
}

function handleAskNext2() {
  if (askCategory.value === "") {
    askError2.textContent = "질문 분야를 선택해 주세요. 잘 모르겠다면 '기타'를 고르면 됩니다.";
    askCategory.classList.add("has-error");
    askCategory.focus();
    return;
  }

  clearAskErrors();
  summaryName.textContent = askName.value.trim();
  summaryCategory.textContent = askCategory.value;
  summaryQuestion.textContent = askQuestion.value.trim();
  showAskStep(3);
  document.querySelector("#askComplete").focus();
}

function handleAskComplete() {
  addMyQuestion();
  showAskStep(4);
  document.querySelector("#askRestart").focus();
}

function handleAskRestart() {
  askName.value = "";
  askQuestion.value = "";
  askCategory.value = "";
  askEtcHelp.hidden = true;
  clearAskErrors();
  summaryName.textContent = "";
  summaryCategory.textContent = "";
  summaryQuestion.textContent = "";
  showAskStep(1);
  askName.focus();
}

// 값을 고치면 해당 칸의 오류 표시를 바로 지웁니다.
function clearFieldError(event) {
  event.currentTarget.classList.remove("has-error");
}

startButton.addEventListener("click", handleStartClick);
document.querySelector("#askNext1").addEventListener("click", handleAskNext1);
askCategory.addEventListener("change", handleCategoryChange);
document.querySelector("#askBack2").addEventListener("click", function () {
  clearAskErrors();
  showAskStep(1);
  askQuestion.focus();
});
document.querySelector("#askNext2").addEventListener("click", handleAskNext2);
document.querySelector("#askBack3").addEventListener("click", function () {
  showAskStep(2);
  askCategory.focus();
});
document.querySelector("#askComplete").addEventListener("click", handleAskComplete);
document.querySelector("#askRestart").addEventListener("click", handleAskRestart);
askName.addEventListener("input", clearFieldError);
askQuestion.addEventListener("input", clearFieldError);

// 중간고사 새 기능: 내 질문 목록과 접수 취소
const myQuestionsMessage = document.querySelector("#myQuestionsMessage");
const myQuestionsEmpty = document.querySelector("#myQuestionsEmpty");
const myQuestionsList = document.querySelector("#myQuestionsList");
const myQuestions = [];
let nextQuestionId = 1;

function addMyQuestion() {
  myQuestions.push({
    id: nextQuestionId,
    name: askName.value.trim(),
    category: askCategory.value,
    question: askQuestion.value.trim(),
    status: "접수됨",
  });
  nextQuestionId += 1;
  myQuestionsMessage.textContent = "질문이 내 질문 목록에 추가되었습니다.";
  renderMyQuestions();
}

function renderMyQuestions() {
  const isEmpty = myQuestions.length === 0;
  myQuestionsEmpty.hidden = !isEmpty;
  myQuestionsList.hidden = isEmpty;
  myQuestionsList.innerHTML = "";

  myQuestions.forEach(function (item) {
    const isCanceled = item.status === "취소됨";
    const li = document.createElement("li");
    li.className = "my-question-item";
    li.classList.toggle("is-canceled", isCanceled);

    const info = document.createElement("div");
    info.className = "my-question-info";

    const status = document.createElement("span");
    status.className = "my-question-status";
    status.textContent = item.status;

    const category = document.createElement("strong");
    category.textContent = item.category;

    const question = document.createElement("p");
    question.className = "my-question-text";
    question.textContent = item.question;

    const name = document.createElement("p");
    name.className = "my-question-name";
    name.textContent = item.name + "님의 질문";

    info.append(status, category, question, name);
    li.append(info);

    // 접수된 질문만 취소할 수 있습니다.
    if (!isCanceled) {
      const cancelButton = document.createElement("button");
      cancelButton.className = "secondary-button";
      cancelButton.type = "button";
      cancelButton.textContent = "접수 취소";
      cancelButton.dataset.id = item.id;
      li.append(cancelButton);
    }

    myQuestionsList.append(li);
  });
}

function handleMyQuestionsClick(event) {
  const cancelButton = event.target.closest("button[data-id]");
  if (cancelButton === null) {
    return;
  }

  const item = myQuestions.find(function (question) {
    return question.id === Number(cancelButton.dataset.id);
  });
  if (item === undefined || item.status !== "접수됨") {
    return;
  }

  const agreed = window.confirm("'" + item.question + "' 질문의 접수를 취소할까요?");
  if (agreed === false) {
    myQuestionsMessage.textContent = "접수를 유지했습니다. 물어봇이 이 질문에 계속 답변을 준비합니다.";
    cancelButton.focus();
    return;
  }

  item.status = "취소됨";
  myQuestionsMessage.textContent = "질문 접수를 취소했습니다. 다시 궁금해지면 새 질문을 접수할 수 있습니다.";
  renderMyQuestions();
  myQuestionsMessage.focus();
}

myQuestionsList.addEventListener("click", handleMyQuestionsClick);
