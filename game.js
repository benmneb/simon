// INITIAL VARIABLES

let gamePattern = [];

let userClickedPattern = [];

let buttonColors = ['red', 'blue', 'green', 'yellow'];

let level = 1;

let started = false;

let muteEverything = false;

let highScore = 1;

let darkMode = false;

// GAME-PLAY

function nextSequence() {
  let randomNumber = (Math.floor(Math.random() * 4));
  let randomChosenColor = buttonColors[randomNumber];
  $('#' + [randomChosenColor]).fadeOut(100).fadeIn(100);
  playSound(randomChosenColor);
  gamePattern.push(randomChosenColor);
  userClickedPattern = [];
  $('h1').text('Level ' + level)
}

$('.game-btn').on('click', function() {
  if (started) {
    let userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  }
});

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      level++;
      setTimeout(() => {
        $('h1').text('Level ' + level);
        calculateHighScore();
      }, 500)
      setTimeout(() => {
        nextSequence();
      }, 1000)
    }
  } else {
    playSound('wrong');
    togglePointers();
    $('h1').text('Game Over');
    $('#subtitle').css('visibility', 'visible').text('Press Spacebar to Restart');
    $('body').addClass('game-over');
    setTimeout(() => {
      $('body').removeClass('game-over');
    }, 200);
    startOver();
  }
}

function startOver() {
  level = 1;
  gamePattern = [];
  started = false;
}

function animatePress(currentColor) {
  $('#' + currentColor).addClass('pressed');
  setTimeout(function() {
    $('#' + currentColor).removeClass('pressed');
  }, 100)
};

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
};

function toggleMuteEverything() {
  if (muteEverything) {
    muteEverything = false;
  } else {
    muteEverything = true;
  }
}

function toggleMuteEverythingRadio() {
  $('input[name="sound"]').not(':checked').prop("checked", true);
}

// KEY-PRESSES

$(document).on('keydown', (e) => {
  switch (e.keyCode) {
    case 32: // spacebar
      if (!started) {
        started = true;
        $('h1').text('Level ' + level)
        calculateHighScore();
        setTimeout(() => {
          nextSequence();
          togglePointers();
        }, 500)
      }
      break;
    case 72: // 'h' key
      if (!isOptionsOpen && !isAboutOpen) {
        if (!isHowToPlayOpen) {
          $('#how-to-play').show();
          isHowToPlayOpen = true;
        } else {
          $('#how-to-play').hide();
          isHowToPlayOpen = false;
        };
      };
      break;
    case 65: // 'a' key
      if (!isHowToPlayOpen && !isOptionsOpen) {
        if (!isAboutOpen) {
          $('#about').show();
          isAboutOpen = true;
        } else {
          $('#about').hide();
          isAboutOpen = false;
        };
      };
      break;
    case 79: // 'o' key
      if (!isHowToPlayOpen && !isAboutOpen) {
        if (!isOptionsOpen) {
          $('#options').show();
          isOptionsOpen = true;
        } else {
          $('#options').hide();
          isOptionsOpen = false;
        };
      };
      break;
    case 68: // 'd' key
      if (!isHowToPlayOpen && !isAboutOpen) {
        toggleDarkMode();
        toggleDarkModeRadio();
      };
      break;
    case 83: // 's'
      if (!isHowToPlayOpen && !isAboutOpen) {
        toggleMuteEverything();
        toggleMuteEverythingRadio();
      };
      break;
    default: null
  }
});

// HIGH SCORE

function calculateHighScore() {
  if (highScore <= level) {
    highScore = level;
  } else {
    highScore = highScore;
  }
  $('#subtitle').text(`High score: ${highScore}`);
}

// MISC AESTHETICS

function blinkText() {
  if (!started) {
    $('#subtitle').css('visibility', 'hidden');
    setTimeout(() => {
      $('#subtitle').css('visibility', 'visible')
    }, 200);
  }
};
setInterval(blinkText, 1500);

function togglePointers() {
  $('div[type=button]').toggleClass('pointer');
};

// DIALOGS

let isHowToPlayOpen = false;
let isAboutOpen = false;
let isOptionsOpen = false;

// open
$("#open-how-to-play").click(() => {
  $("#how-to-play").show();
  isHowToPlayOpen = true;
});
$("#open-about").click(() => {
  $("#about").show();
  isAboutOpen = true;
});
$("#open-options").click(() => {
  $("#options").show();
  isOptionsOpen = true;
});

// close
$("#close-how-to-play").click(() => {
  $("#how-to-play").hide();
  isHowToPlayOpen = false;
});
$("#close-options").click(() => {
  $("#options").hide();
  isOptionsOpen = false;
});
$("#close-about").click(() => {
  $("#about").hide();
  isAboutOpen = false;
});

// const howToPlay = $("#how-to-play")[0];
// const options = $("#options")[0];
// const about = $("#about")[0];

// window.onclick = (e) => {
//   if (event.target == howToPlay) {
//     howToPlay.style.display = "none";
//   } else if (event.target == options) {
//     options.style.display = "none";
//   } else if (event.target == about) {
//     about.style.display = "none";
//   }
// }

// DARK-MODE

function toggleDarkMode() {
  darkMode ? darkMode = false : darkMode = true;
  $('body').toggleClass('dark-body');
  $('h1').toggleClass('dark-h1');
  $('.headings h2').toggleClass('dark-h2');
  $('.controls').toggleClass('dark-controls');
  // $('.game-btn').toggleClass('dark-container');
  $('.modal-content').toggleClass('dark-dialog');
  $('.nes-radio').toggleClass('is-dark');
}

$('#dark-mode-on').click(() => {
  if (!darkMode) {
    toggleDarkMode();
    console.log('dMoff', $('#dark-mode-off').prop('checked'));
    console.log('dMon', $('#dark-mode-on').prop('checked'));
  }
})

$('#dark-mode-off').click(() => {
  if (darkMode) {
    toggleDarkMode();
    console.log('dMoff', $('#dark-mode-off').prop('checked'));
    console.log('dMon', $('#dark-mode-on').prop('checked'));
  }
})

function toggleDarkModeRadio() {
  $('input[name="dark-mode"]').not(':checked').prop("checked", true);
}
