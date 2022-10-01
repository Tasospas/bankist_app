'use strict';

const account1 = {
  owner: 'John Pelekoudas',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Lefteris Eskitzglou',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Anastasios Passias',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Giannis Papakonstantinou',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// // Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Δημιουργία ονομάτων χρηστών για κάθε λογαριασμό, το πρωτο γραμμα απο όνομα και επίθετο

const computeUsernames = function (accs) {
  accs.forEach(function (acc, i) {
    //console.log(acc);
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(firstLetter => firstLetter[0])
      .join('');
    //console.log(acc.username);
  });
};

computeUsernames(accounts);

//console.log(accounts);

// Συνάρτηση που δείχνει τη ροή των κινήσεων στους λογαριασμούς

const showMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, i) {
    const type = movement > 0 ? 'Deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1}
    </div>
    <div class="movements__date">4/1/2050</div>
    <div class="movements__value">${movement}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// DRY Principle

const updateUI = function (accs) {
  showMovements(currentAccount.movements);
  computeBalanceSum(currentAccount);
  computeSummary(currentAccount);
};

let currentAccount;

// Διαδικασία πατήματος κουμπιού - Log-In

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //console.log('LogIn');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log('Login');
  // console.log(currentAccount);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';

    updateUI(currentAccount);
  }
});

// Συνάρτηση που υπολογίζει το εκάστοτε σύνολο σε κάθε τραπεζικό λογαριασμό

const computeBalanceSum = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => mov + acc, 0);
  //console.log(balance);

  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};

// Συνάρτηση για τον υπολογισμό και την εμφάνιση των συνολικών ροών των λογαριασμών και για το ρυθμό ενδιαφέροντος

const computeSummary = function (accs) {
  const income = accs.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  //console.log(income);

  const outcome = accs.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;
  //console.log(outcome);

  const interest = accs.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accs.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = ` ${interest}€`;
};

// Συνάρτηση υπε΄ύθυνη για τη μεταφορά χρηματικών ποσών μεταξύ των λογαριασμών

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const accReceiver = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, accReceiver);

  if (
    amount > 0 &&
    accReceiver &&
    currentAccount.balance >= amount &&
    accReceiver.username !== currentAccount.username
  ) {
    console.log('Transfer is completed');
    currentAccount.movements.push(-amount);

    accReceiver.movements.push(amount);
    updateUI(currentAccount);
  }
});

// Συν΄άρτηση υπευθυνη για το Log out

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    console.log('Log Out success');
    const position = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(position, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
});

// Συνάρτηση για ΄΄εγκριση δανείου

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    console.log('Loan accepted');
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
});
