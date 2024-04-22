// Account modal
// Edit Account modal
// Success modal
// Source modal
// Leaderboard modal
// Tutorial modal
// Settings modal


// Account modal
let accountModal = document.querySelector(".accountModal");
let accountBtn = document.querySelector(".accountButton");
let closeAccountBtn = document.querySelector(".closeAccountBtn");
let editAccontInfo = document.querySelector('.editAccountInfo');

accountBtn.addEventListener('click', () => {
  accountModal.style.display = "block";
})

closeAccountBtn.addEventListener('click', () => {
  accountModal.style.display = "none";
})

window.addEventListener('click', (e) => {
  if (e.target == accountModal) {
    accountModal.style.display = "none";
  }
}) 

editAccontInfo.addEventListener('click', () => {
  accountModal.style.display = "none";
  editAccountModal.style.display = "block";
})





// Edit account modal
let editAccountModal = document.querySelector(".editAccountModal");
let closeEditAccountBtn = document.querySelector(".closeEditAccountBtn");
let secondCloseEditAccountBtn = document.querySelector(".secondCloseEditAccountBtn");

closeEditAccountBtn.addEventListener('click', () => {
  editAccountModal.style.display = "none";
})

secondCloseEditAccountBtn.addEventListener('click', () => {
  editAccountModal.style.display = "none";
})

window.addEventListener('click', (e) => {
  if (e.target == editAccountModal) {
    editAccountModal.style.display = "none";
  }
})




	
/*  Settings  */
let settingsModal = document.querySelector('.settingsModal')
let settingsBtn = document.querySelector('.settingsButton')
let closeSettingsBtn = document.querySelector('.closeSettingsBtn')

settingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'block'
})

closeSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none'
})

window.addEventListener('click', (e) => {
  if (e.target == settingsModal) {
    settingsModal.style.display = "none";
  }
})





/* Sources */
let sourceBtn = document.querySelector('.sourceButton')
let sourceModal = document.querySelector('.sourceModal')
let closeSourceBtn = document.querySelector('.closeSourceBtn')

sourceBtn.addEventListener('click', () => {
  sourceModal.style.display = 'block'
})

closeSourceBtn.addEventListener('click', () => {
  sourceModal.style.display = 'none'
})

window.addEventListener('click', (e) => {
  if (e.target == sourceModal) {
    sourceModal.style.display = "none";
  }
})





/* Leaderboard */
let leaderBtn = document.querySelector('.leaderButton')
let leaderboardModal = document.querySelector('.leaderboardModal')
let closeLeaderboardBtn = document.querySelector('.closeLeaderboardBtn')

leaderBtn.addEventListener('click', () => {
  leaderboardModal.style.display = 'block'
})

closeLeaderboardBtn.addEventListener('click', () => {
  leaderboardModal.style.display = 'none'
})

window.addEventListener('click', (e) => {
  if (e.target == leaderboardModal) {
    leaderboardModal.style.display = "none";
  }
})





/* Tutorial */
let tutorialBtn = document.querySelector('.tutorialButton')
let tutorialModal = document.querySelector('.tutorialModal')
let closeTutorialBtn = document.querySelector('.closeTutorialBtn')

tutorialBtn.addEventListener('click', () => {
  tutorialModal.style.display = 'block'
})

closeTutorialBtn.addEventListener('click', () => {
  tutorialModal.style.display = 'none'
})

window.addEventListener('click', (e) => {
  if (e.target == tutorialModal) {
    tutorialModal.style.display = "none";
  }
})





/* Open and close navbar */
let displayOptionsBtn = document.querySelector('.displayOptionsButton')
let removeOptionsBtn = document.querySelector('.removeOptionsButton')

let navbarLeft = document.querySelector('.navbarLeft')
let navbarRight = document.querySelector('.navbarRight')

let gameBoardContainer = document.querySelector('.gameBoardContainer')

displayOptionsBtn.addEventListener('click', () => {
  gameBoardContainer.style.height = `${gameBoardContainer.offsetHeight}px`
  navbarLeft.style.display = 'flex'
  navbarRight.style.display = 'flex'
  displayOptionsBtn.style.display = 'none'
  removeOptionsBtn.style.display = 'flex'
})

removeOptionsBtn.addEventListener('click', () => {
  navbarLeft.style.display = 'none'
  navbarRight.style.display = 'none'
  displayOptionsBtn.style.display = 'flex'
  removeOptionsBtn.style.display = 'none'
})

window.addEventListener('resize', () => {
  if (window.innerWidth > 599) {
    navbarLeft.style.display = 'flex'
    navbarRight.style.display = 'flex'
    displayOptionsBtn.style.display = 'none'
    removeOptionsBtn.style.display = 'flex'
    verticalDividor.style.display = 'block'
    horisontalDividor.style.display = 'none'
  } else {
    navbarLeft.style.display = 'none'
    navbarRight.style.display = 'none'
    displayOptionsBtn.style.display = 'flex'
    removeOptionsBtn.style.display = 'none'
    verticalDividor.style.display = 'none'
    horisontalDividor.style.display = 'block'
  }
});





/* Divivdor */
let verticalDividor = document.querySelector('.verticalDividor')
let horisontalDividor = document.querySelector('.horisontalDividor')

if (window.innerWidth > 799) {
  verticalDividor.style.display = 'block'
  horisontalDividor.style.display = 'none'
} else {
  verticalDividor.style.display = 'none'
  horisontalDividor.style.display = 'block'
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 799) {
    verticalDividor.style.display = 'block'
    horisontalDividor.style.display = 'none'
  } else {
    verticalDividor.style.display = 'none'
    horisontalDividor.style.display = 'block'
  }
});
