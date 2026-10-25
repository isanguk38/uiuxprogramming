

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
// 9주차: 흐름 전체를 하나의 form으로 묶고 입력 상태·검증·제출 결과를 표시합니다.
const askForm = document.querySelector("#askFlow");
const askSteps = document.querySelectorAll(".ask-step");
const askProgress = document.querySelector("#askProgress");
const askName = document.querySelector("#askName");
const askQuestion = document.querySelector("#askQuestion");
const askCategory = document.querySelector("#askCategory");
const askEtcHelp = document.querySelector("#askEtcHelp");
const askEmailCheck = document.querySelector("#askEmailCheck");
const emailField = document.querySelector("#emailField");
const askEmail = document.querySelector("#askEmail");
const askSubmitMessage = document.querySelector("#askSubmitMessage");
const askBack3 = document.querySelector("#askBack3");
const askComplete = document.querySelector("#askComplete");
const askRestart = document.querySelector("#askRestart");
const summaryName = document.querySelector("#summaryName");
const summaryCategory = document.querySelector("#summaryCategory");
const summaryQuestion = document.querySelector("#summaryQuestion");
const summaryReply = document.querySelector("#summaryReply");
const askStepNames = ["질문 작성", "분야 선택", "내용 확인"];
const QUESTION_MIN_LENGTH = 10;
let currentAskStep = 1;

// 도움말의 처음 문구를 저장해 두었다가, 조건을 충족하지 않으면 다시 보여 줍니다.
document.querySelectorAll(".ask-field .ask-help").forEach(function (help) {
  help.dataset.help = help.textContent;
});

function showAskStep(step) {
  currentAskStep = step;
  askSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });
  askProgress.textContent = step <= 3
    ? step + " / 3 · " + askStepNames[step - 1]
    : "접수 완료";
}

// 입력 조건: 문제가 있으면 수정 방법을 담은 문장을, 없으면 빈 문자열을 돌려줍니다.
function getNameError() {
  if (askName.value.trim() === "") {
    return "이름을 입력해 주세요.";
  }
  return "";
}

function getQuestionError() {
  const question = askQuestion.value.trim();
  if (question === "") {
    return "궁금한 점을 입력해 주세요.";
  }
  if (question.length < QUESTION_MIN_LENGTH) {
    return "궁금한 점을 " + QUESTION_MIN_LENGTH + "자 이상 적어 주세요. 예: 수강신청 정정 기간이 언제예요?";
  }
  return "";
}

function getCategoryError() {
  if (askCategory.value === "") {
    return "질문 분야를 선택해 주세요. 잘 모르겠다면 '기타'를 고르면 됩니다.";
  }
  return "";
}

function getEmailError() {
  // 이메일 칸이 숨겨져(disabled) 있으면 검사하지 않습니다.
  if (askEmail.disabled) {
    return "";
  }
  if (askEmail.value.trim() === "") {
    return "답변 받을 이메일을 입력해 주세요. 이메일로 받지 않으려면 체크를 해제하세요.";
  }
  if (askEmail.validity.typeMismatch) {
    return "이메일 형식을 확인해 주세요. 예: name@example.com";
  }
  return "";
}

function showFieldError(input, message) {
  const field = input.closest(".ask-field");
  input.setAttribute("aria-invalid", "true");
  field.classList.add("is-error");
  setFieldValid(input, false);
  field.querySelector(".field-error").textContent = message;
}

function clearFieldError(input) {
  const field = input.closest(".ask-field");
  input.removeAttribute("aria-invalid");
  field.classList.remove("is-error");
  field.querySelector(".field-error").textContent = "";
}

// 성공 상태는 초록 테두리와 함께 도움말 문구로도 알려 줍니다.
function setFieldValid(input, isValid) {
  const field = input.closest(".ask-field");
  const help = field.querySelector(".field-meta .ask-help");
  field.classList.toggle("is-valid", isValid);
  help.textContent = isValid ? "입력 조건을 충족했습니다." : help.dataset.help;
}

function validateField(input, getError) {
  const message = getError();
  if (message !== "") {
    showFieldError(input, message);
    return false;
  }
  clearFieldError(input);
  return true;
}

// 입력할 때마다 글자 수와 조건 충족 여부를 갱신합니다.
// 오류가 표시된 칸은 현재 값으로 다시 검사해, 올바르게 고치면 오류를 바로 해제합니다.
function updateTextField(input, getError) {
  const count = input.closest(".ask-field").querySelector(".field-count");
  if (count !== null) {
    count.textContent = input.value.length + " / " + input.maxLength + "자";
  }
  if (input.getAttribute("aria-invalid") === "true") {
    validateField(input, getError);
  }
  setFieldValid(input, getError() === "" && input.getAttribute("aria-invalid") !== "true");
}

function focusFirstError() {
  const firstError = askForm.querySelector('[aria-invalid="true"]');
  if (firstError !== null) {
    firstError.focus();
  }
}

function handleStartClick() {
  // 6주차의 안내 확인 조건을 통과한 경우에만 흐름에 들어갑니다.
  if (agreeCheck.checked === false) {
    return;
  }
  askForm.hidden = false;
  showAskStep(1);
  askForm.scrollIntoView({ behavior: "smooth", block: "start" });
  askName.focus();
}

function validateStep1() {
  const nameOk = validateField(askName, getNameError);
  const questionOk = validateField(askQuestion, getQuestionError);
  return nameOk && questionOk;
}

function validateStep2() {
  const categoryOk = validateField(askCategory, getCategoryError);
  const emailOk = validateField(askEmail, getEmailError);
  return categoryOk && emailOk;
}

function handleAskNext1() {
  if (!validateStep1()) {
    focusFirstError();
    return;
  }
  showAskStep(2);
  askCategory.focus();
}

function handleCategoryChange() {
  askEtcHelp.hidden = askCategory.value !== "기타";
  if (askCategory.getAttribute("aria-invalid") === "true") {
    validateField(askCategory, getCategoryError);
  }
}

// 체크 여부에 따라 이메일 칸의 표시와 입력 가능 상태를 함께 바꿉니다.
// 숨긴 칸은 disabled로 바꿔 제출값(FormData)에서도 빠지게 합니다.
function setEmailFieldOpen(isOpen) {
  emailField.hidden = !isOpen;
  askEmail.disabled = !isOpen;
  askEmailCheck.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen) {
    clearFieldError(askEmail);
  }
}

function handleEmailCheckChange() {
  setEmailFieldOpen(askEmailCheck.checked);
  if (askEmailCheck.checked) {
    askEmail.focus();
  }
}

function handleAskNext2() {
  if (!validateStep2()) {
    focusFirstError();
    return;
  }

  summaryName.textContent = askName.value.trim();
  summaryCategory.textContent = askCategory.value;
  summaryQuestion.textContent = askQuestion.value.trim();
  summaryReply.textContent = askEmailCheck.checked
    ? "화면에서 확인 + 이메일(" + askEmail.value.trim() + ")"
    : "화면에서 확인";
  setSubmitState("idle");
  showAskStep(3);
  askComplete.focus();
}

const submitMessages = {
  idle: "",
  loading: "질문을 보내고 있습니다. 잠시만 기다려 주세요.",
  error: "질문을 저장하지 못했습니다. 입력한 내용은 그대로 남아 있으니 '다시 보내기'를 눌러 주세요.",
};

// 저장 중에는 버튼을 잠가 중복 제출을 막고, 결과 문구와 버튼 문구를 함께 바꿉니다.
function setSubmitState(state) {
  const isLoading = state === "loading";
  askForm.setAttribute("aria-busy", String(isLoading));
  askComplete.disabled = isLoading;
  askBack3.disabled = isLoading;
  if (isLoading) {
    askComplete.textContent = "보내는 중…";
  } else if (state === "error") {
    askComplete.textContent = "다시 보내기";
  } else {
    askComplete.textContent = "질문 보내기";
  }
  askSubmitMessage.textContent = submitMessages[state];
  askSubmitMessage.classList.toggle("is-loading", isLoading);
  askSubmitMessage.classList.toggle("is-error", state === "error");
}

// 버튼 클릭과 Enter가 모두 이 submit 이벤트로 들어옵니다.
function handleAskSubmit(event) {
  event.preventDefault();

  // 1·2단계에서 Enter를 누르면 다음 단계 버튼과 같게 처리합니다.
  if (currentAskStep === 1) {
    handleAskNext1();
    return;
  }
  if (currentAskStep === 2) {
    handleAskNext2();
    return;
  }
  if (currentAskStep !== 3 || askComplete.disabled) {
    return;
  }

  // 최종 검사: 오류가 있으면 그 단계를 다시 열고 첫 오류 칸으로 초점을 옮깁니다.
  if (!validateStep1()) {
    showAskStep(1);
    focusFirstError();
    return;
  }
  if (!validateStep2()) {
    showAskStep(2);
    focusFirstError();
    return;
  }

  const data = new FormData(askForm);
  setSubmitState("loading");
  saveMyQuestion(data);
}

function handleAskRestart() {
  askForm.reset();
  [askName, askQuestion, askCategory, askEmail].forEach(clearFieldError);
  updateTextField(askName, getNameError);
  updateTextField(askQuestion, getQuestionError);
  setFieldValid(askEmail, false);
  setEmailFieldOpen(false);
  askEtcHelp.hidden = true;
  summaryName.textContent = "";
  summaryCategory.textContent = "";
  summaryQuestion.textContent = "";
  summaryReply.textContent = "";
  setSubmitState("idle");
  showAskStep(1);
  askName.focus();
}

startButton.addEventListener("click", handleStartClick);
askForm.addEventListener("submit", handleAskSubmit);
document.querySelector("#askNext1").addEventListener("click", handleAskNext1);
askCategory.addEventListener("change", handleCategoryChange);
askEmailCheck.addEventListener("change", handleEmailCheckChange);
document.querySelector("#askBack2").addEventListener("click", function () {
  showAskStep(1);
  askQuestion.focus();
});
document.querySelector("#askNext2").addEventListener("click", handleAskNext2);
askBack3.addEventListener("click", function () {
  setSubmitState("idle");
  showAskStep(2);
  askCategory.focus();
});
askRestart.addEventListener("click", handleAskRestart);
askName.addEventListener("input", function () {
  updateTextField(askName, getNameError);
});
askQuestion.addEventListener("input", function () {
  updateTextField(askQuestion, getQuestionError);
});
askEmail.addEventListener("input", function () {
  updateTextField(askEmail, getEmailError);
});

// 중간고사 새 기능: 내 질문 목록과 접수 취소
// 9주차: 접수한 질문을 브라우저 저장소(localStorage)에 저장합니다.
const myQuestionsMessage = document.querySelector("#myQuestionsMessage");
const myQuestionsEmpty = document.querySelector("#myQuestionsEmpty");
const myQuestionsList = document.querySelector("#myQuestionsList");
const MY_QUESTIONS_KEY = "mureobot-my-questions";
const SAVE_DELAY = 1000;
const myQuestions = [];
let nextQuestionId = 1;

function storeMyQuestions(items) {
  localStorage.setItem(MY_QUESTIONS_KEY, JSON.stringify(items));
}

function loadMyQuestions() {
  try {
    const saved = JSON.parse(localStorage.getItem(MY_QUESTIONS_KEY)) || [];
    saved.forEach(function (item) {
      myQuestions.push(item);
      nextQuestionId = Math.max(nextQuestionId, item.id + 1);
    });
  } catch (error) {
    // 저장소를 읽을 수 없으면 빈 목록으로 시작합니다.
  }
  renderMyQuestions();
}

function saveMyQuestion(data) {
  // 저장하는 동안의 기다림을 보여 주기 위해 잠시 뒤에 저장합니다.
  setTimeout(function () {
    const item = {
      id: nextQuestionId,
      name: data.get("askName").trim(),
      category: data.get("askCategory"),
      question: data.get("askQuestion").trim(),
      email: data.has("askEmail") ? data.get("askEmail").trim() : "",
      status: "접수됨",
    };

    try {
      storeMyQuestions(myQuestions.concat(item));
    } catch (error) {
      // 실패 조건: 저장 공간이 가득 찼거나 브라우저가 사이트 데이터 저장을 막은 경우
      // 입력값은 그대로 두고 버튼을 다시 활성화해 같은 내용으로 다시 보낼 수 있게 합니다.
      setSubmitState("error");
      askComplete.focus();
      return;
    }

    myQuestions.push(item);
    nextQuestionId += 1;
    myQuestionsMessage.textContent = "질문이 내 질문 목록에 추가되었습니다.";
    renderMyQuestions();
    setSubmitState("idle");
    showAskStep(4);
    askRestart.focus();
  }, SAVE_DELAY);
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
  try {
    storeMyQuestions(myQuestions);
  } catch (error) {
    // 저장소에 쓰지 못해도 화면의 상태 변경은 유지합니다.
  }
  myQuestionsMessage.textContent = "질문 접수를 취소했습니다. 다시 궁금해지면 새 질문을 접수할 수 있습니다.";
  renderMyQuestions();
  myQuestionsMessage.focus();
}

myQuestionsList.addEventListener("click", handleMyQuestionsClick);
loadMyQuestions();
