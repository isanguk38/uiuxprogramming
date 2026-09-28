

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