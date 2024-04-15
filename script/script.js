let username = ''
let password = ''
let equalPassword = ''
let newAccount


/* XXXXXXXXXXXXXXXXXXXXXXX */
/*  User status  */
auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelector('.innerPage').style.display = 'block'; 
    document.querySelector('.accountPage').style.display = 'none';

    if (newAccount){
      document.querySelector('.successAccountModal').style.display = 'block'; 
    } else {
      document.querySelector('.successAccountModal').style.display = 'none'; 
    }

		let enterFirstTimeBtn = document.querySelector('.enterFirstTime')
		enterFirstTimeBtn.addEventListener('click', () => {
				document.querySelector('.successAccountModal').style.display = 'none'; 
		})


		/* XXXXXXXXXXXXXXXXXXXXXXX */
		/* Set new Username */
		let setNewAccountDetailsBtn = document.querySelector('.setNewAccountDetails')
		let setNewUsername = document.querySelector('.setNewUsername')
		setNewAccountDetailsBtn.addEventListener('click', () => {
			if(setNewUsername.value){
				db.collection('users').doc(user.uid).update({username : setNewUsername.value})
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
		/*  Sources  */

		let sourceBtn = document.querySelector('.sourceButton')
		let sourceAccountModal = document.querySelector('.sourceAccountModal')
		sourceBtn.addEventListener('click', () => {
			sourceAccountModal.style.display = 'block'
		})

		let closeSourceAccountModalBtn = document.querySelector('.closeSourceAccountModal')
		closeSourceAccountModalBtn.addEventListener('click', () => {
			sourceAccountModal.style.display = 'none'
		})

		/* XXXXXXXXXXXXXXXXXXXXXXX */
		/*  Leaderboard  */

		let leaderBtn = document.querySelector('.leaderButton')
		let leaderboardAccountModal = document.querySelector('.leaderboardAccountModal')
		leaderBtn.addEventListener('click', () => {
			leaderboardAccountModal.style.display = 'block'
		})

		let closeLeaderboardAccountModalBtn = document.querySelector('.closeLeaderboardAccountModal')
		closeLeaderboardAccountModalBtn.addEventListener('click', () => {
			leaderboardAccountModal.style.display = 'none'
		})

		db.collection('users').onSnapshot(snapshot => {
			let userCollection = []
			let liveLeaderboard = []
			for(let i = 0; i < snapshot.docs.length; i++){
				userCollection.push({highscore: snapshot.docs[i].data().higscore, username: snapshot.docs[i].data().username, uid: snapshot.docs[i].id})
			}
			
			liveLeaderboard = userCollection.sort((a, b) => b.highscore - a.highscore);

			let leaderboardUsersTable = document.querySelector('.leaderboardUsersTable')
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

			

			let testScore = document.querySelector('.testScore')
			let testSubmit = document.querySelector('.testSubmit')
			testSubmit.addEventListener('click', () =>{
				db.collection('users').doc(user.uid).update({
					higscore: Number(testScore.value)
				})
			})
		})

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

		
  } else {
    document.querySelector('.accountPage').style.display = 'flex';
    document.querySelector('.innerPage').style.display = 'none'; 
    document.querySelector('.loggin').classList.add('showMain')
  }
})



/* XXXXXXXXXXXXXXXXXXXXXXX */
/* Game  */

let playBtn = document.querySelector('.playButton')
let pauseBtn = document.querySelector('.pauseButton')

playBtn.addEventListener('click', () => {
	document.querySelector('.playButton').style.display = 'none';
	document.querySelector('.pauseButton').style.display = 'flex'; 
})

pauseBtn.addEventListener('click', () => {
	document.querySelector('.playButton').style.display = 'flex';
	document.querySelector('.pauseButton').style.display = 'none'; 
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
      document.querySelector('.innerPage').style.display = 'block'; 
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