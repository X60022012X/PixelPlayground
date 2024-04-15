// Account modal
let accountModal = document.querySelector(".accountModal");
let accountBtn = document.querySelector(".accountButton");
let closeAccountModalBtn = document.querySelector(".closeAccountModal");
let editAccontInfo = document.querySelector('.editAccountInfo');

accountBtn.addEventListener('click', function() {
  accountModal.style.display = "block";
})

closeAccountModalBtn.addEventListener('click', function() {
  accountModal.style.display = "none";
})

window.addEventListener('click', function(event) {
  if (event.target == accountModal) {
    accountModal.style.display = "none";
  }
}) 

editAccontInfo.addEventListener('click', function(){
  accountModal.style.display = "none";
  editAccountModal.style.display = "block";
})

// Edit account modal
let editAccountModal = document.querySelector(".editAccountModal");
let editAccountInfoBtn = document.querySelector(".editAccountInfo");
let closeEditAccountModal = document.querySelector(".closeEditAccountModal");
let closeEditAccountModalBtn = document.querySelector(".closeEditAccountModalBtn");


editAccountInfoBtn.addEventListener('click', function() {
  editAccountModal.style.display = "block";
})

closeEditAccountModal.addEventListener('click', function() {
  editAccountModal.style.display = "none";
})

closeEditAccountModalBtn.addEventListener('click', function() {
  editAccountModal.style.display = "none";
})

window.addEventListener('click', function(event) {
  if (event.target == editAccountModal) {
    editAccountModal.style.display = "none";
  }
})


