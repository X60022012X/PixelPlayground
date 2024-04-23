let username = ''
let password = ''
let equalPassword = ''
let newAccount


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*  User status  */
auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelector('.innerPage').style.display = 'flex'; 
    document.querySelector('.accountPage').style.display = 'none';


		/* XXXXXXXXXXXXXXXXXXXXXXX */
		/* First time loggin check */
    if (newAccount){
      document.querySelector('.successModal').style.display = 'block'; 
    } else {
      document.querySelector('.successModal').style.display = 'none'; 
    }

		let enterFirstTimeBtn = document.querySelector('.enterFirstTime')
		enterFirstTimeBtn.addEventListener('click', () => {
				document.querySelector('.successModal').style.display = 'none'; 
		})


		/* XXXXXXXXXXXXXXXXXXXXXXX */
		/* Set new Username */
		let editAccountModal = document.querySelector(".editAccountModal");
		let setNewAccountDetailsBtn = document.querySelector('.setNewAccountDetails')
		let setNewUsername = document.querySelector('.setNewUsername')
		setNewAccountDetailsBtn.addEventListener('click', () => {
			if(setNewUsername.value){
				db.collection('users').doc(user.uid).update({username : setNewUsername.value})
				setNewUsername.value = ''
				editAccountModal.style.display = 'none'
			}
		})


		/* XXXXXXXXXXXXXXXXXXXXXXX */
		/* Display Account Info */
	
		let accountInfoEmail = document.querySelector('.accountInfoEmail')
		accountInfoEmail.innerHTML = `<span class="accountInfoSpan">Email:</span> ${user.email}`

		let accountInfoUsername = document.querySelector('.accountInfoUsername')
		db.collection('users').doc(user.uid).onSnapshot(doc => {
			accountInfoUsername.innerHTML = `<span class="accountInfoSpan">Username:</span> ${doc.data().username}`
		})

		let currentUsername = document.querySelector('.currentUsername')
		db.collection('users').doc(user.uid).onSnapshot(doc => {
			currentUsername.innerHTML = `Current username: ${doc.data().username}`
		})


		/* XXXXXXXXXXXXXXXXXXXXXXX */
		/*  Game  */
		let numRows;
		let numCols;
		let numMines;
		let emptyCellsRevealed = 0;
		let minesMarked = 0;
		let timer;
		let score;
		let sec;

		let minefieldSize = document.querySelector('.minefieldSize')
		let minePrecentage = document.querySelector('.minePrecentage')
		let changes = document.querySelector('.setChangesSettings')
		let refreshGame = document.querySelector('.refreshGame')
		let canvas = document.querySelector('.gameBoardContainer')

		changes.addEventListener('click', () => {
			settingsModal.style.display = 'none'
			startGame()
		})

		refreshGame.addEventListener('click', () => {
			startGame()
		})

		function startGame() {
			let canvasWidth = canvas.offsetWidth
			let canvasHeight = canvas.offsetHeight

			score = 0;
			emptyCellsRevealed = 0;
			minesMarked = 0;

			numRows =(canvasHeight - 5) / 42
			numCols = (canvasWidth - 5) / 42
			
			if(minefieldSize.value == 'S'){
				numRows = Math.floor(numRows * 0.6)
				numCols = Math.floor(numCols * 0.6)
			} else if(minefieldSize.value == 'M'){
				numRows = Math.floor(numRows * 0.8)
				numCols = Math.floor(numCols * 0.8)
			} else if(minefieldSize.value == 'L'){
				numRows = Math.floor(numRows)
				numCols = Math.floor(numCols)
			}
			
			numMines = Math.floor((numRows * numCols) * (Number(minePrecentage.value)/100))
			
			initializeBoard();
			renderBoard();
			clearInterval(timer);
			startTimer();
		}

		/*  Start Timer  */
		function startTimer(){
			sec = 999;
			timer = setInterval(function(){
					document.querySelector('.gameTimer').innerHTML=sec;
					sec--;
					if (sec < 0) {
							clearInterval(timer);
					}
			}, 1000);
		}



		const gameBoard = document.querySelector(".gameBoard");
		let board = [];


		/*  Initialize Board  */
		function initializeBoard() {
			for (let i = 0; i < numRows; i++) {
				board[i] = [];

				for (let j = 0; j < numCols; j++) {
					board[i][j] = {
						isMine: false,
						revealed: false,
						marked: false,
						count: 0,
					};
				}
			}

			/*  Place mines  */
			let minesPlaced = 0;
			while (minesPlaced < numMines) {
				const row = Math.floor(
					Math.random() * numRows
				);
				const col = Math.floor(
					Math.random() * numCols
				);
				if (!board[row][col].isMine) {
					board[row][col].isMine = true;
					minesPlaced++;
				}
			}

			/* Calculate counts */
			for (let i = 0; i < numRows; i++) {
				for (let j = 0; j < numCols; j++) {
					if (!board[i][j].isMine) {
						let count = 0;
						for (let dx = -1; dx <= 1; dx++) {
							for (let dy = -1; dy <= 1; dy++) {
								const ni = i + dx;
								const nj = j + dy;
								if (ni >= 0 && ni < numRows && nj >= 0 && nj < numCols && board[ni][nj].isMine) {
									count++;
								}
							}
						}
						board[i][j].count = count;
					}
				}
			}
		}


		/* Buttons */
		let markMineBtn = document.querySelector('.markMine')
		let revealCellBtn = document.querySelector('.revealCell')
		let markMineActive = false
		let revealCellActive = true
		revealCellBtn.classList.add('activeGameBtn')

		markMineBtn.addEventListener('click', () => {
			markMineActive = true
			markMineBtn.classList.add('activeGameBtn')
			revealCellActive = false
			revealCellBtn.classList.remove('activeGameBtn')
		})

		revealCellBtn.addEventListener('click', () => {
			markMineActive = false
			markMineBtn.classList.remove('activeGameBtn')
			revealCellActive = true
			revealCellBtn.classList.add('activeGameBtn')
		})

		window.addEventListener("keydown", (e) => {
			if (e.code == 'Space') {
				markMineActive = true
				markMineBtn.classList.add('activeGameBtn')
				revealCellActive = false
				revealCellBtn.classList.remove('activeGameBtn')
			}
		});

		window.addEventListener("keyup", (e) => {
			if (e.code == 'Space') {
				markMineActive = false
				markMineBtn.classList.remove('activeGameBtn')
				revealCellActive = true
				revealCellBtn.classList.add('activeGameBtn')
			}
		});

		/* Reveal Cell */
		function revealCell(row, col) {
			if (row < 0 || row >= numRows || col < 0 || col >= numCols || board[row][col].revealed || board[row][col].marked) {
				return;
			}

			board[row][col].revealed = true;

			if (board[row][col].isMine) {
				delayedGameLost()
			} else if (minesMarked == numMines && emptyCellsRevealed == ((numRows * numCols) - numMines - 1)) {
				delayedGameWon()
			} else if (board[row][col].count === 0) {
				emptyCellsRevealed++;
				for (let dx = -1; dx <= 1; dx++) {
					for (let dy = -1; dy <= 1; dy++) {
							revealCell(row + dx,col + dy);
					}
				}
			} else {
				emptyCellsRevealed++; 
			}
			renderBoard();
		} 

			
		/* Mark Cell */
		function markCell(row, col) {
			if (row < 0 || row >= numRows || col < 0 || col >= numCols || board[row][col].revealed) {
				return;
			}
			
			if (board[row][col].marked){
				board[row][col].marked = false;
				minesMarked--
			} else if (!board[row][col].marked){
				board[row][col].marked = true;
				minesMarked++
			} 
			
			if (minesMarked == numMines && emptyCellsRevealed == ((numRows * numCols) - numMines)) {
				delayedGameWon()
			}
			renderBoard();
		}

		/* Render Board */
		function renderBoard() {
			gameBoard.innerHTML = "";

			for (let i = 0; i < numRows; i++) {
				for (let j = 0; j < numCols; j++) {
					const cell = document.createElement("div");
					cell.className = "cell";
					if (board[i][j].revealed) {
						cell.classList.add("revealed");
						if (board[i][j].isMine) {
							cell.classList.add("mine");
						} else if (board[i][j].count > 0) {
							cell.textContent =board[i][j].count;
						}
					}

					if (board[i][j].marked) {
						cell.classList.add("marked");
					}

					cell.addEventListener("click", () => {
						if(markMineActive){
							markCell(i, j)
						} else if(revealCellActive){
							revealCell(i, j)
						}
					})
					gameBoard.appendChild(cell);
				}
				gameBoard.appendChild(document.createElement("br"));
			}
		}


		/* Game Won */
		function delayedGameWon(){
			setTimeout(gameWon, 500); 
		}

		function gameWon(){
			score = Math.floor(sec * numCols * numRows * Number(minePrecentage.value)/100)
			clearInterval(timer)

			let newHighscore = document.querySelector(".newHighscore");
			let notNewHighscore = document.querySelector(".notNewHighscore");

			
			db.collection('users').doc(user.uid).get().then((doc) => {
				if(score > doc.data().higscore){
					newHighscore.style.display = 'flex'
					notNewHighscore.style.display = 'none'
					let prevWinningHighscore = document.querySelector(".prevWinningHighscore");
					prevWinningHighscore.innerHTML = `Previous highscore: ${doc.data().higscore}`
					let winningScoreHigh = document.querySelector(".winningScoreHigh");
					winningScoreHigh.innerHTML = `New highscore: ${score}`
					doc.ref.update({ higscore: Number(score) });
				} else {
					newHighscore.style.display = 'none'
					notNewHighscore.style.display = 'flex'
					let winningHighscore = document.querySelector(".winningHighscore");
					winningHighscore.innerHTML = `Highscore: ${doc.data().higscore}`
					let winningScoreLow = document.querySelector(".winningScoreLow");
					winningScoreLow.innerHTML = `Score: ${score}`
				}
			})
			
			let minefieldSizeText;
			if(minefieldSize.value == 'S'){
				minefieldSizeText = 'Beginner'
			} else if (minefieldSize.value == 'M'){
				minefieldSizeText = 'Intermediate'
			} else if (minefieldSize.value =='L'){
				minefieldSizeText = 'Expert'
			}

			let winningMinefieldSize = document.querySelector(".winningMinefieldSize");
			winningMinefieldSize.innerHTML = `Minefield size: ${minefieldSizeText}`
			let winningMinePrecentage = document.querySelector(".winningMinePrecentage");
			winningMinePrecentage.innerHTML = `Mine precentage: ${minePrecentage.value}%`
			let winningTime = document.querySelector(".winningTime");
			winningTime.innerHTML = `Time left: ${sec}sek`

			let winningModal = document.querySelector(".winningModal");
			let closeWinningBtn = document.querySelector(".closeWinningBtn");
			let setNewHighscore = document.querySelector(".setNewHighscore");	
			let tryGameAgian = document.querySelector(".tryGameAgian");
			winningModal.style.display = "block";
			
			closeWinningBtn.addEventListener('click', () => {
				winningModal.style.display = 'none'
				startGame()
			})

			setNewHighscore.addEventListener('click', () => {
				winningModal.style.display = "none";
				startGame()
			})

			tryGameAgian.addEventListener('click', () => {
				winningModal.style.display = "none";
				startGame()
			})

			window.addEventListener('click', (e) => {
				if (e.target == winningModal) {
					winningModal.style.display = "none";
					startGame()
				}
			})

		}


		/* Game Lost */
		function delayedGameLost(){
			setTimeout(gameLost, 500); 
		}

		function gameLost(){
			score = Math.floor(sec * numCols * numRows * Number(minePrecentage.value)/100)
			clearInterval(timer)
			
			db.collection('users').doc(user.uid).get().then((doc) => {
				let loosingHighscore = document.querySelector(".loosingHighscore");
				loosingHighscore.innerHTML = `Highscore: ${doc.data().higscore}`

				let loosingScore = document.querySelector(".loosingScore");
				loosingScore.innerHTML = `Score: ${score}`
			})
			
			let minefieldSizeText;
			if(minefieldSize.value == 'S'){
				minefieldSizeText = 'Beginner'
			} else if (minefieldSize.value == 'M'){
				minefieldSizeText = 'Intermediate'
			} else if (minefieldSize.value =='L'){
				minefieldSizeText = 'Expert'
			}

			let loosingMinefieldSize = document.querySelector(".loosingMinefieldSize");
			loosingMinefieldSize.innerHTML = `Minefield size: ${minefieldSizeText}`

			let loosingMinePrecentage = document.querySelector(".loosingMinePrecentage");
			loosingMinePrecentage.innerHTML = `Mine precentage: ${minePrecentage.value}%`

			let loosingTime = document.querySelector(".loosingTime");
			loosingTime.innerHTML = `Time left: ${sec}sek`

			let loosingModal = document.querySelector(".loosingModal");
			let closeLoosingBtn = document.querySelector(".closeLoosingBtn");
			let lossTryGameAgian = document.querySelector(".lossTryGameAgian");
			loosingModal.style.display = "block";
			
			closeLoosingBtn.addEventListener('click', () => {
				loosingModal.style.display = 'none'
				startGame()
			})

			lossTryGameAgian.addEventListener('click', () => {
				loosingModal.style.display = "none";
				startGame()
			})

			window.addEventListener('click', (e) => {
				if (e.target == loosingModal) {
					loosingModal.style.display = "none";
					startGame()
				}
			})
			
		}
		startGame();


		/* XXXXXXXXXXXXXXXXXXXXXXX */
		/*  Leaderboard  */
		db.collection('users').onSnapshot(snapshot => {
			let userCollection = []
			let liveLeaderboard = []
			for(let i = 0; i < snapshot.docs.length; i++){
				userCollection.push({highscore: snapshot.docs[i].data().higscore, username: snapshot.docs[i].data().username, uid: snapshot.docs[i].id})
			}
			
			liveLeaderboard = userCollection.sort((a, b) => b.highscore - a.highscore);
			let leaderboardUsersTableModal = document.querySelector('.leaderboardUsersTableModal')
			leaderboardUsersTableModal.innerHTML = ``
			for(let i = 0; i < 10; i++){
				if(liveLeaderboard[i].uid == user.uid){
					leaderboardUsersTableModal.innerHTML += `
						<div class="leaderboardUsers">
							<p class="leaderboardUsersPositionRelative">${i+1}.</p>
							<div class="leaderboardUsersUsernameAndScoreRelative">
								<p class="leaderboardUsersUsername">${liveLeaderboard[i].username}</p>
								<p class="leaderboardUsersScore">${liveLeaderboard[i].highscore}</p>
							</div>
						</div>`
				} else {
					leaderboardUsersTableModal.innerHTML += `
						<div class="leaderboardUsers">
							<p class="leaderboardUsersPosition">${i+1}.</p>
							<div class="leaderboardUsersUsernameAndScore">
								<p class="leaderboardUsersUsername">${liveLeaderboard[i].username}</p>
								<p class="leaderboardUsersScore">${liveLeaderboard[i].highscore}</p>
							</div>
						</div>`
				}
			}

			for(let i = 0; i < liveLeaderboard.length; i++){
				if(liveLeaderboard[i].uid == user.uid){
					if(i > 10){
						leaderboardUsersTableModal.innerHTML += `
						<i class="fa-solid fa-arrows-up-down"></i>
						<div class="leaderboardUsers">
							<p class="leaderboardUsersPositionRelative">${i+1}.</p>
							<div class="leaderboardUsersUsernameAndScoreRelative">
								<p class="leaderboardUsersUsername">${liveLeaderboard[i].username}</p>
								<p class="leaderboardUsersScore">${liveLeaderboard[i].highscore}</p>
							</div>
						</div>`
					} 
				}
			}
		})

  } else {
    document.querySelector('.accountPage').style.display = 'flex';
    document.querySelector('.innerPage').style.display = 'none'; 
    document.querySelector('.loggin').classList.add('showMain')
  }

	/* XXXXXXXXXXXXXXXXXXXXXXX */
		/* Create account  */
		let createAccountButton = document.querySelector('.createAccountButton')

		createAccountButton.addEventListener('click', () => {
			let email = document.getElementById("createEmail").value;
			let username = document.getElementById("createUsername").value;
			let password = document.getElementById("createPassword").value;
			let equalPassword = document.getElementById("confirmCreatePassword").value;
			let success = 0
			
			if(email == ''){
				document.querySelector('#createEmail').classList.add('alert')
				document.querySelector('.createEmailAlertEmpty').classList.add('show')
			} else if(email.length < 8){
				document.querySelector('#createEmail').classList.add('alert')
				document.querySelector('.createEmailAlertLength').classList.add('show')
			} else {
				success ++;
			}

			if(username == ''){
				document.querySelector('#createUsername').classList.add('alert')
				document.querySelector('.createUsernameAlertEmpty').classList.add('show')
			} else if(username.length < 8){
				document.querySelector('#createUsername').classList.add('alert')
				document.querySelector('.createUsernameAlertLength').classList.add('show')
			} else {
				success ++;
			}

			if(password == ''){
				document.querySelector('#createPassword').classList.add('alert')
				document.querySelector('.createPasswordAlertEmpty').classList.add('show')
			} else if(password.length < 8){
				document.querySelector('#createPassword').classList.add('alert')
				document.querySelector('.createPasswordAlertLength').classList.add('show')
			} else if(password.length > 7 && equalPassword.length > 7 && password != equalPassword){
				document.querySelector('#createPassword').classList.add('alert')
				document.querySelector('.createPasswordAlertEqual').classList.add('show')
				document.querySelector('#confirmCreatePassword').classList.add('alert')
				document.querySelector('.confirmCreatePasswordAlertEqual').classList.add('show')
			} else {
				success ++;
			}

			if(equalPassword == ''){
				document.querySelector('#confirmCreatePassword').classList.add('alert')
				document.querySelector('.confirmCreatePasswordAlertEmpty').classList.add('show')
			} else if(equalPassword.length < 8){
				document.querySelector('#confirmCreatePassword').classList.add('alert')
				document.querySelector('.confirmCreatePasswordAlertLength').classList.add('show')
			} else {
				success ++;
			}

			if(success == 4){
				newAccount = true
				auth.createUserWithEmailAndPassword(email, password).then(cred => {
					return db.collection('users').doc(cred.user.uid).set({
						username: username,
						higscore: 0
					}) 
				}).catch((error) => {
					console.log(error.code)
					if (error.code == 'auth/email-already-in-use') {
						document.querySelector('#createEmail').classList.add('alert')
						document.querySelector('.createEmailAlertInUse').classList.add('show')
					} else if(error.code == 'auth/invalid-email') {
						document.querySelector('#createEmail').classList.add('alert')
						document.querySelector('.createEmailAlertInvalid').classList.add('show')
					} else {
						errorSignup()
					}
				})
			}
		})
})


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*  Logout function  */
let loggout = document.querySelector('.loggOutButton')
loggout.addEventListener('click', () => {
  auth.signOut();
	location.reload();
})


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*  Login function  */
let loggIntoAccount = document.querySelector('.loggIntoAccount')

loggIntoAccount.addEventListener('click', () => {
	let email = document.getElementById("loggEmail").value;
	let password = document.getElementById("loggPassword").value;
	if(email == '' && password == ''){
		document.querySelector('#loggEmail').classList.add('alert')
		document.querySelector('.loggEmailAlertEmpty').classList.add('show')
		document.querySelector('#loggPassword').classList.add('alert')
		document.querySelector('.loggPasswordAlertEmpty').classList.add('show')
	} else if(email == ''){
		document.querySelector('#loggEmail').classList.add('alert')
		document.querySelector('.loggEmailAlertEmpty').classList.add('show')
	}	else if(password == ''){
		document.querySelector('#loggPassword').classList.add('alert')
		document.querySelector('.loggPasswordAlertEmpty').classList.add('show')
	} else {
    auth.signInWithEmailAndPassword(email, password).then(() => {
      document.querySelector('.innerPage').style.display = 'flex'; 
      document.querySelector('.accountPage').style.display = 'none';
      newAccount = false
    }).catch((error) => {
			console.log(error.code)
			if (error.code == 'auth/invalid-email') {
				wrongEmailOrPassword()
			} else {
				errorLogin()
			}
		})
  };
});



/* XXXXXXXXXXXXXXXXXXXXXXX */
/* Unknown error loggin */
function errorLogin(){
	document.querySelector('.loggEmailAlertUnknown').classList.add('show')
	document.querySelector('.loggPasswordAlertUnknown').classList.add('show')

	document.querySelector('#loggEmail').classList.add('alert') 
	document.querySelector('#loggPassword').classList.add('alert')
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/* Unknown error signup */
function errorSignup(){
	document.querySelector('.createEmailAlertUnknown').classList.add('show')
	document.querySelector('.createUsernameAlertUnknown').classList.add('show')
	document.querySelector('.createPasswordAlertUnknown').classList.add('show')
	document.querySelector('.confirmCreatePasswordAlertUnknown').classList.add('show')

	document.querySelector('#createEmail').classList.add('alert')
	document.querySelector('#createUsername').classList.add('alert')
	document.querySelector('#createPassword').classList.add('alert')
	document.querySelector('#confirmCreatePassword').classList.add('alert')
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/* Go to create account page */
goToSignupBtn = document.querySelector('.goToSignup')
goToSignupBtn.addEventListener('click', () =>{
	document.querySelector('.loggin').classList.remove('showMain')
	document.querySelector('.createAccount').classList.add('showMain')
	clearCreateEmail();
	clearCreateUsername();
	clearCreatePassword();
	clearConfirmCreatePassword();
})


/* XXXXXXXXXXXXXXXXXXXXXXX */
/* Go to login page */
goToLoginBtn = document.querySelector('.goToLogin')
goToLoginBtn.addEventListener('click', () => {
	document.querySelector('.loggin').classList.add('showMain')
	document.querySelector('.createAccount').classList.remove('showMain')
	clearLoggEmail();
	clearLoggPassword();
})


/* XXXXXXXXXXXXXXXXXXXXXXX */
/* Wrong Email or Password */
function wrongEmailOrPassword(){
	document.querySelector('#loggEmail').classList.add('alert') 
	document.querySelector('#loggPassword').classList.add('alert')
	document.querySelector('.loggEmailAlertWrong').classList.add('show')
	document.querySelector('.loggPasswordAlertWrong').classList.add('show')
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*Clear Logg Email*/
document.querySelector('#loggEmail').addEventListener("focus", clearLoggEmail)

function clearLoggEmail(){
	document.querySelector('#loggEmail').classList.remove('alert') 
	document.querySelector('.loggEmailAlertEmpty').classList.remove('show')
	document.querySelector('.loggEmailAlertWrong').classList.remove('show')
	document.querySelector('.loggEmailAlertUnknown').classList.remove('show')
	document.querySelector('#loggEmail').value = ''
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*Clear Logg Password*/
document.querySelector('#loggPassword').addEventListener("focus", clearLoggPassword)

function clearLoggPassword(){
	document.querySelector('#loggPassword').classList.remove('alert')
	document.querySelector('.loggPasswordAlertEmpty').classList.remove('show')
	document.querySelector('.loggPasswordAlertWrong').classList.remove('show')
	document.querySelector('.loggPasswordAlertUnknown').classList.remove('show')
	document.querySelector('#loggPassword').value = ''
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*Clear Create Email*/
document.querySelector('#createEmail').addEventListener("focus", clearCreateEmail)

function clearCreateEmail(){
	document.querySelector('#createEmail').classList.remove('alert')
	document.querySelector('.createEmailAlertEmpty').classList.remove('show')
	document.querySelector('.createEmailAlertLength').classList.remove('show')
	document.querySelector('.createEmailAlertInUse').classList.remove('show')
	document.querySelector('.createEmailAlertInvalid').classList.remove('show')
	document.querySelector('.createEmailAlertUnknown').classList.remove('show')
	document.querySelector('#createEmail').value = ''
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*Clear Create Username*/
document.querySelector('#createUsername').addEventListener("focus", clearCreateUsername)

function clearCreateUsername(){
	document.querySelector('#createUsername').classList.remove('alert')
	document.querySelector('.createUsernameAlertEmpty').classList.remove('show')
	document.querySelector('.createUsernameAlertLength').classList.remove('show')
	document.querySelector('.createUsernameAlertUnknown').classList.remove('show')
	document.querySelector('#createUsername').value = ''
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*Clear Create Password*/
document.querySelector('#createPassword').addEventListener("focus", clearCreatePassword)

function clearCreatePassword(){
	document.querySelector('#createPassword').classList.remove('alert')
	document.querySelector('.createPasswordAlertEmpty').classList.remove('show')
	document.querySelector('.createPasswordAlertLength').classList.remove('show')
	document.querySelector('.createPasswordAlertEqual').classList.remove('show')
	document.querySelector('.createPasswordAlertUnknown').classList.remove('show')
	document.querySelector('#createPassword').value = ''
}


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*Clear Create Confirm Password*/
document.querySelector('#confirmCreatePassword').addEventListener("focus", clearConfirmCreatePassword)

function clearConfirmCreatePassword(){
	document.querySelector('#confirmCreatePassword').classList.remove('alert')
	document.querySelector('.confirmCreatePasswordAlertEmpty').classList.remove('show')
	document.querySelector('.confirmCreatePasswordAlertLength').classList.remove('show')
	document.querySelector('.confirmCreatePasswordAlertEqual').classList.remove('show')
	document.querySelector('.confirmCreatePasswordAlertUnknown').classList.remove('show')
	document.querySelector('#confirmCreatePassword').value = ''
}