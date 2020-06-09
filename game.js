// MEDIA-QUERIES

const smlDevice = window.matchMedia('(max-width: 800px)');

smlDevice.addListener(deviceWidth);

function deviceWidth() {
  if (smlDevice.matches) {
    $('#subtitle').text('Tap Anywhere to Start');
    $('.keyboards-only').hide();
    $('.hotkey').addClass('hotkey-gone');
    addTouchToStart();
  } else {
    $('#subtitle').text('Press Spacebar to Start');
    $('.keyboards-only').show();
    $('.hotkey').removeClass('hotkey-gone');
  };
};
deviceWidth(smlDevice);

// start game on click anywhere except the buttons and their dialogs
function addTouchToStart() {
  $(document).click(function(event) {
    const target = $(event.target);
    if (!target.closest('.dont-start').length && !started) {
      startGame();
    }
  });
};

// 'LOADING' BAR

function load() {
  var progress = 0;
  var speed = setInterval(frame, (Math.random() * 50));

  function frame() {
    if (progress >= 100) {
      clearInterval(speed);
      setTimeout(() => {
        $('.loading-bg').fadeOut(50);
      }, 200)
    } else {
      progress += (Math.random() * 5);
      $('.nes-progress').attr('value', progress);
    }
  };
};

$(document).ready(load());

// INITIAL VARIABLES

let gamePattern = [];

let userClickedPattern = [];

let buttonColors = ['red', 'blue', 'green', 'yellow'];

let level = 1;

let started = false;

let muteEverything = false;

let highScore = 0;

let darkMode = false;

let isHowToPlayOpen = false;
let isAboutOpen = false;
let isOptionsOpen = false;

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

$('.game-btn').on('click touchstart', function() {
  if (started) {
    let userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
    return false;
  };
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
    if (smlDevice.matches) {
      $('#subtitle').text('Tap Anywhere to Restart');
    } else {
      $('#subtitle').text('Press Spacebar to Restart');
    };
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

function startGame() {
  started = true;
  $('h1').text('Level ' + level)
  calculateHighScore();
  setTimeout(() => {
    nextSequence();
    togglePointers();
  }, 500);
}

$(document).on('keydown', (e) => {
  switch (e.keyCode) {
    case 32: // spacebar
      if (!started && !isOptionsOpen && !isAboutOpen && !isHowToPlayOpen) {
        startGame();
      };
      break;
    case 72: // 'h'
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
    case 65: // 'a'
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
    case 79: // 'o'
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
    case 68: // 'd'
      if (!isHowToPlayOpen && !isAboutOpen) {
        toggleDarkMode();
        toggleDarkModeRadio();
      };
      break;
    case 83: // 's'
      if (!isHowToPlayOpen && !isAboutOpen && !isOptionsOpen) {
        toggleMuteEverything();
        toggleMuteEverythingRadio();
        showSoundsNotification();
      } else if (isOptionsOpen) {
        toggleMuteEverything();
        toggleMuteEverythingRadio();
      };
      break;
    case 67: // 'c'
    case 13: // enter
    case 27: // escape
      if (isHowToPlayOpen || isAboutOpen || isOptionsOpen) {
        $('#how-to-play').hide();
        isHowToPlayOpen = false;
        $('#options').hide();
        isAboutOpen = false;
        $('#about').hide();
        isOptionsOpen = false;
      };
      break;
    case 71: // 'g'
    case 86: // 'v'
      if (isAboutOpen) {
        window.open('https://github.com/benmneb', '_blank')
      }
      break;
    case 84: // 't'
      if (isAboutOpen) {
        window.open('https://www.appbrewery.co/', '_blank')
      }
      break;
    case 78: // 'n'
      if (isAboutOpen) {
        window.open('https://github.com/nostalgic-css/NES.css', '_blank')
      }
      break;
    default:
      null
  }
});

// HIGH SCORE

function calculateHighScore() {
  if (highScore <= level) {
    highScore = level;
    $('#subtitle').html(`High score: ${highScore}`);
  } else {
    highScore = highScore;
    $('#subtitle').text(`High score: ${highScore}`);
  }
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

function showSoundsNotification() {
  if (muteEverything) {
    $('#sound-notification-text').text('Sounds off.')
  } else if (!muteEverything) {
    $('#sound-notification-text').text('Sounds on.')
  };
  $('#sound-notification').show().delay(2000).slideUp();
};

// DIALOGS

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
  $('.nes-balloon').toggleClass('is-dark');
}

$('#dark-mode-on').click(() => {
  if (!darkMode) {
    toggleDarkMode();
  }
})

$('#dark-mode-off').click(() => {
  if (darkMode) {
    toggleDarkMode();
  }
})

function toggleDarkModeRadio() {
  $('input[name="dark-mode"]').not(':checked').prop("checked", true);
}
