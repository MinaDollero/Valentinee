// Simple JS for the Valentine page (no APIs required)
(function(){
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const initialView = document.getElementById('initial');
  const angryView = document.getElementById('angry');
  const successView = document.getElementById('success');
  const resetFromAngry = document.getElementById('resetFromAngry');
  const triesText = document.getElementById('triesText');
  const card = document.getElementById('card');
  const buttonsArea = document.getElementById('buttons');

  let noCount = 0;
  let cardRect = null;

  function centerNo() {
    const rect = buttonsArea.getBoundingClientRect();
    const btn = noBtn;
    const left = rect.left + rect.width/2 - btn.offsetWidth/2;
    const top = rect.top + rect.height/2 - btn.offsetHeight/2;
    const cardRectLocal = card.getBoundingClientRect();
    btn.style.left = (left - cardRectLocal.left) + 'px';
    btn.style.top = (top - cardRectLocal.top) + 'px';
  }

  function moveNoButton() {
    if (!cardRect) cardRect = card.getBoundingClientRect();
    noCount++;
    if (noCount >= 3) {
      showAngry();
      return;
    }
    const paddingX = 16;
    const paddingY = 16;
    const maxX = Math.max(0, cardRect.width - noBtn.offsetWidth - paddingX);
    const maxY = Math.max(0, cardRect.height - noBtn.offsetHeight - paddingY - 60);
    const x = Math.max(paddingX, Math.random() * maxX);
    const y = Math.max(paddingY, Math.random() * maxY);
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
  }

  function showAngry(){
    initialView.classList.add('hidden');
    angryView.classList.remove('hidden');
    if (triesText) triesText.textContent = 'You tried to press "No" ' + (noCount) + ' times...';
  }

  function showSuccess(){
    initialView.classList.add('hidden');
    successView.classList.remove('hidden');
  }

  function resetAll(){
    noCount = 0;
    angryView.classList.add('hidden');
    successView.classList.add('hidden');
    initialView.classList.remove('hidden');
    setTimeout(() => {
      cardRect = card.getBoundingClientRect();
      centerNo();
    }, 50);
  }

  yesBtn.addEventListener('click', function(){
    showSuccess();
  });

  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('click', function(e){
    e.preventDefault();
    moveNoButton();
  });

  resetFromAngry.addEventListener('click', resetAll);

  // generate floating hearts & initialize position
  window.addEventListener('load', () => {
    cardRect = card.getBoundingClientRect();
    noBtn.style.position = 'absolute';
    centerNo();

    const heartsContainer = document.getElementById('hearts');
    const count = 22;
    for (let i=0;i<count;i++){
      const span = document.createElement('div');
      span.className = 'heart';
      span.innerText = '❤️';
      const left = Math.random() * 100;
      const size = Math.random() * 26 + 10;
      const delay = Math.random() * 8;
      const duration = Math.random() * 14 + 10;
      span.style.left = left + '%';
      span.style.fontSize = size + 'px';
      span.style.animationDelay = delay + 's';
      span.style.animationDuration = duration + 's';
      span.style.opacity = '0.4';
      heartsContainer.appendChild(span);
    }
  });

  window.addEventListener('resize', () => {
    cardRect = card.getBoundingClientRect();
    centerNo();
  });

})();