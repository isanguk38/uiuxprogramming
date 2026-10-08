

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
