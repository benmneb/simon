// INITIAL VARIABLES

let gamePattern = [];

let userClickedPattern = [];

let buttonColors = ['red', 'blue', 'green', 'yellow'];

let level = 1;

let started = false;

let muteEverything = false;

let highScore = 1;

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
    $('h1').text('Game Over')
    $('#subtitle').css('visibility', 'visible').text('Press Spacebar to Restart')
    $('body').addClass('game-over');
    setTimeout(() => {
      $('body').removeClass('game-over')
    }, 200)
    startOver();
  }
}

function startOver() {
  level = 1;
  gamePattern = [];
  started = false;
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
};

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
      $('#how-to-play').toggle();
      break;
    case 65: // 'a' key
      $('#about').toggle();
      break;
    case 79: // 'o' key
      $('#options').toggle();
      break;
    default: null
  }
});

function animatePress(currentColor) {
  $('#' + currentColor).addClass('pressed');
  setTimeout(function() {
    $('#' + currentColor).removeClass('pressed');
  }, 100)
};

// HIGH SCORE

function calculateHighScore() {
  if (highScore <= level) {
    highScore = level;
  } else {
    highScore = highScore;
  }
  $('#subtitle').text(`Highscore: ${highScore}`);
}

// AESTHETICS

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

// MODALS/DIALOGS

// open
$("#open-how-to-play").click(() => {
  $("#how-to-play").show()
});
$("#open-about").click(() => {
  $("#about").show()
});
$("#open-options").click(() => {
  $("#options").show()
});

// close
$("#close-how-to-play").click(() => {
  $("#how-to-play").hide();
});
$("#close-options").click(() => {
  $("#options").hide();
});
$("#close-about").click(() => {
  $("#about").hide();
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
