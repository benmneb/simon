// INITIAL VARIABLES

let gamePattern = [];

let userClickedPattern = [];

let buttonColors = ['red', 'blue', 'green', 'yellow'];
let buttonsClickable = false;

let level = 1;

let started = false;

let muteEverything = false;

let highScore = 0;

let darkMode = false;

let isHowToPlayOpen = false;
let isAboutOpen = false;
let isOptionsOpen = false;
let isLeaderboardOpen = false;
let isAddHighScoreOpen = false;

let leaderboard = null;

let nameIsValid = false;

// GAME-PLAY

function nextSequence() {
  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];
  $('#' + [randomChosenColor])
    .fadeOut(100)
    .fadeIn(100);
  playSound(randomChosenColor);
  gamePattern.push(randomChosenColor);
  userClickedPattern = [];
  $('h1').text('Level ' + level);
}

$('.game-btn').on('click touchstart', function () {
  if (started && buttonsClickable) {
    let userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
    return false;
  }
});

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      buttonsClickable = false;
      level++;
      setTimeout(() => {
        $('h1').text('Level ' + level);
        calculateHighScore();
      }, 500);
      setTimeout(() => {
        buttonsClickable = true;
        nextSequence();
      }, 1000);
    }
  } else {
    playSound('wrong');
    togglePointers();
    $('h1').text('Game Over');
    if (smlDevice.matches) {
      $('#subtitle').text('Tap Anywhere to Restart');
    } else {
      $('#subtitle').text('Press Spacebar to Restart');
    }
    $('body').addClass('game-over');
    setTimeout(() => {
      $('body').removeClass('game-over');
    }, 200);
    startOver();
  }
}

function startOver() {
  checkIfHighScore();
  level = 1;
  gamePattern = [];
  started = false;
  $('footer').fadeIn(50);
}

function animatePress(currentColor) {
  $('#' + currentColor).addClass('pressed');
  setTimeout(function () {
    $('#' + currentColor).removeClass('pressed');
  }, 100);
}

// SOUNDS

$('#sound-on').click(() => {
  muteEverything = false;
});
$('#sound-off').click(() => {
  muteEverything = true;
});

function playSound(name) {
  if (!muteEverything) {
    let sound = new Audio('sounds/' + name + '.mp3');
    sound.play();
  }
}

function toggleMuteEverything() {
  if (muteEverything) {
    muteEverything = false;
  } else {
    muteEverything = true;
  }
}

function toggleMuteEverythingRadio() {
  $('input[name="sound"]').not(':checked').prop('checked', true);
}

// KEY-PRESSES

function startGame() {
  started = true;
  buttonsClickable = true;
  $('h1').text('Level ' + level);
  calculateHighScore();
  $('footer').fadeOut(50);
  setTimeout(() => {
    nextSequence();
    togglePointers();
  }, 500);
}

$(document).on('keydown', (e) => {
  switch (e.keyCode) {
    case 32: // spacebar
      if (!started && !isOptionsOpen && !isAboutOpen && !isHowToPlayOpen && !isLeaderboardOpen && !isAddHighScoreOpen) {
        startGame();
      }
      break;
    case 72: // 'h'
      if (!isOptionsOpen && !isAboutOpen && !isLeaderboardOpen && !isAddHighScoreOpen) {
        if (!isHowToPlayOpen) {
          $('#how-to-play').fadeIn(50);
          isHowToPlayOpen = true;
        } else {
          $('#how-to-play').hide();
          isHowToPlayOpen = false;
        }
      }
      break;
    case 65: // 'a'
      if (!isHowToPlayOpen && !isOptionsOpen && !isLeaderboardOpen && !isAddHighScoreOpen) {
        if (!isAboutOpen) {
          $('#about').show();
          isAboutOpen = true;
        } else {
          $('#about').hide();
          isAboutOpen = false;
        }
      }
      break;
    case 79: // 'o'
      if (!isHowToPlayOpen && !isAboutOpen && !isLeaderboardOpen && !isAddHighScoreOpen) {
        if (!isOptionsOpen) {
          $('#options').show();
          isOptionsOpen = true;
        } else {
          $('#options').hide();
          isOptionsOpen = false;
        }
      }
      break;
    case 76: // 'l'
      if (!isHowToPlayOpen && !isAboutOpen && !isOptionsOpen && !isAddHighScoreOpen) {
        if (!isLeaderboardOpen) {
          $('#leaderboard').show();
          isLeaderboardOpen = true;
        } else {
          $('#leaderboard').hide();
          isLeaderboardOpen = false;
        }
      }
    case 68: // 'd'
      if (!isHowToPlayOpen && !isAboutOpen && !isLeaderboardOpen && !isAddHighScoreOpen) {
        toggleDarkMode();
        toggleDarkModeRadio();
      }
      break;
    case 83: // 's'
      if (!isHowToPlayOpen && !isAboutOpen && !isOptionsOpen && !isLeaderboardOpen && !isAddHighScoreOpen) {
        toggleMuteEverything();
        toggleMuteEverythingRadio();
        showSoundsNotification();
      } else if (isOptionsOpen) {
        toggleMuteEverything();
        toggleMuteEverythingRadio();
      }
      break;
    case 67: // 'c'
    case 13: // enter
    case 27: // escape
      if (isHowToPlayOpen || isAboutOpen || isOptionsOpen || isLeaderboardOpen) {
        $('#how-to-play').hide();
        isHowToPlayOpen = false;
        $('#options').hide();
        isAboutOpen = false;
        $('#about').hide();
        isOptionsOpen = false;
        $('#leaderboard').hide();
        isLeaderboardOpen = false;
        $('#add-high-score').hide();
        isAddHighScoreOpen = false;
      }
      break;
    case 71: // 'g'
    case 86: // 'v'
      if (isAboutOpen) {
        window.open('https://github.com/benmneb', '_blank');
      }
      break;
    case 84: // 't'
      if (isAboutOpen) {
        window.open('https://www.appbrewery.co/', '_blank');
      }
      break;
    case 78: // 'n'
      if (isAboutOpen) {
        window.open('https://github.com/nostalgic-css/NES.css', '_blank');
      }
      break;
    default:
      null;
  }
});

// HIGH SCORE

function calculateHighScore() {
  if (highScore <= level) {
    highScore = level;
  } else {
    highScore = highScore;
  }
  $('#subtitle').text(`Highest level: ${highScore}`);
}

// MISC AESTHETICS

function blinkText() {
  if (!started) {
    $('#subtitle').css('visibility', 'hidden');
    setTimeout(() => {
      $('#subtitle').css('visibility', 'visible');
    }, 200);
  }
}
setInterval(blinkText, 1500);

function togglePointers() {
  $('div[type=button]').toggleClass('pointer');
}

function showSoundsNotification() {
  if (muteEverything) {
    $('#sound-notification-text').text('Sounds off.');
  } else if (!muteEverything) {
    $('#sound-notification-text').text('Sounds on.');
  }
  $('#sound-notification').show().delay(2000).slideUp();
}

// DIALOGS

// open
$('#open-how-to-play').click(() => {
  $('#how-to-play').show();
  isHowToPlayOpen = true;
});
$('#open-about').click(() => {
  $('#about').show();
  isAboutOpen = true;
});
$('#open-options').click(() => {
  $('#options').show();
  isOptionsOpen = true;
});
$('#open-leaderboard').click(() => {
  $('#leaderboard').show();
  isLeaderboardOpen = true;
});

// close
$('#close-how-to-play').click(() => {
  $('#how-to-play').hide();
  isHowToPlayOpen = false;
});
$('#close-options').click(() => {
  $('#options').hide();
  isOptionsOpen = false;
});
$('#close-about').click(() => {
  $('#about').hide();
  isAboutOpen = false;
});
$('#close-leaderboard').click(() => {
  $('#leaderboard').hide();
  isLeaderboardOpen = false;
});
$('#close-add-high-score').click(() => {
  $('#add-high-score').hide();
  isAddHighScoreOpen = false;
  $('#name').removeClass('is-error');
  $('#name-label').removeClass('nes-text is-error');
});

// DARK-MODE

function toggleDarkMode() {
  darkMode ? (darkMode = false) : (darkMode = true);
  $('body').toggleClass('dark-body');
  $('h1').toggleClass('dark-h1');
  $('.headings h2').toggleClass('dark-h2');
  $('.controls').toggleClass('dark-controls');
  // $('.game-btn').toggleClass('dark-container');
  $('.dialog-content').toggleClass('dark-dialog');
  $('.nes-radio').toggleClass('is-dark');
  $('.nes-balloon').toggleClass('is-dark');
  $('.loading-bg').toggleClass('dark-loading-bg');
  $('.loading-container p').toggleClass('dark-title');
  $('.leaderboard table').toggleClass('is-dark');
}

$('#dark-mode-on').click(() => {
  if (!darkMode) {
    toggleDarkMode();
  }
});

$('#dark-mode-off').click(() => {
  if (darkMode) {
    toggleDarkMode();
  }
});

function toggleDarkModeRadio() {
  $('input[name="dark-mode"]').not(':checked').prop('checked', true);
}

// MEDIA-QUERIES

function deviceWidth() {
  console.log('device wdith');
  if (smlDevice.matches) {
    $('#subtitle').text('Tap Anywhere to Start');
    $('.keyboards-only').hide();
    $('.hotkey').addClass('hotkey-gone');
    addTouchToStart();
  } else {
    if (!started) {
      $('#subtitle').text('Press Spacebar to Start');
    }
    $('.keyboards-only').show();
    $('.hotkey').removeClass('hotkey-gone');
  }
}
const smlDevice = window.matchMedia('(max-width: 800px)');
smlDevice.addEventListener('change', deviceWidth);

// on mobile size screens: start game on touch anywhere except the buttons and their dialogs
function addTouchToStart() {
  $(document).click((event) => {
    const target = $(event.target);
    if (!target.closest('.dont-start').length && !started && smlDevice.matches) {
      startGame();
    }
  });
}

// prefers color scheme
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefersDark) {
  toggleDarkMode();
  toggleDarkModeRadio();
}

// LEADERBOARD

function setLeaderboard(data) {
  console.log('leaderboard set:', data);
  leaderboard = data;
  $('#leaderboard-body').empty();
  leaderboard.map((leader, index) => {
    $(
      `<tr><td class="user-name text-left">${
        index === 0 ? `<i class="nes-icon star is-small"></i> ${leader.name}` : leader.name
      }</td><td>${leader.score}</tr>`
    ).appendTo('#leaderboard-body');
  });
}

// fetch scores on intial page load
async function getScores() {
  try {
    const response = await fetch('http://localhost:5000/api');
    const data = await response.json();
    setLeaderboard(data);
  } catch (error) {
    console.error(error.message);
  }
}

function prettyPosition(position) {
  if (position === 1) return '1st';
  if (position === 2) return '2nd';
  if (position === 3) return '3rd';
  else return `${position}th`;
}

// check score on game over
function checkIfHighScore() {
  if (leaderboard.length < 5 || level > leaderboard[leaderboard.length - 1].score) {
    let position = leaderboard.findIndex((leader) => level >= Number(leader.score)) + 1;
    if (leaderboard.findIndex((leader) => level === Number(leader.score)) > -1) {
      // equaled a currently existing high-score, so place the new score below it on leaderboard
      position = position + 1;
    }
    $('#success-level').text(level);
    $('#success-position').text(prettyPosition(position));
    $('#score').val(level);
    $('#add-high-score').show();
    isAddHighScoreOpen = true;
  }
}

// submit score
function validateName() {
  nameIsValid = false;
  let enteredName = $('#name').val();
  if (!enteredName) {
    $('#name').addClass('is-error');
    $('#name-label').addClass('nes-text is-error');
    setTimeout(() => {
      $('#name').removeClass('is-error');
      $('#name-label').removeClass('nes-text is-error');
    }, 2000);
  } else if (enteredName.length > 7) {
    $('#name').addClass('is-error');
    $('#name-label').text('Name too long').addClass('nes-text is-error');
    setTimeout(() => {
      $('#name').removeClass('is-error');
      $('#name-label').text('Your name:').removeClass('nes-text is-error');
    }, 2000);
  } else {
    $('#name').removeClass('is-error');
    $('#name-label').text('Your name:').removeClass('nes-text is-error');
    nameIsValid = true;
  }
}

async function submitHighScore() {
  const data = {
    name: $('#name').val(),
    score: $('#success-level').text(),
  };

  try {
    const request = await fetch('http://localhost:5000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const response = await request.json();
    console.log('high score submitted:', response);
    await getScores();
    $('#add-high-score').hide();
    isAddHighScoreOpen = false;
    $('#leaderboard').show();
    isLeaderboardOpen = true;
  } catch (error) {
    console.error('Error submitting score:', error.message);
  }
}

$('#submit-high-score').click((e) => {
  e.preventDefault();
  validateName();
  if (nameIsValid) submitHighScore();
});

$('#name').on('keydown', (e) => {
  // 'enter' key
  if (e.keyCode === 13) {
    validateName();
    if (nameIsValid) submitHighScore();
  }
});

// 'LOADING' BAR

function pretendToLoad() {
  let progress = 0;
  let speed = setInterval(frame, Math.random() * 50);

  function frame() {
    if (progress >= 100) {
      clearInterval(speed);
      setTimeout(() => {
        $('.loading-bg').fadeOut(50);
      }, 200);
    } else {
      progress += Math.random() * 5;
      $('.nes-progress').attr('value', progress);
    }
  }
}

$(document).ready(() => {
  pretendToLoad();
  getScores();
});
