let gamePattern = [];

let userClickedPattern = [];

let buttonColors = ['red', 'blue', 'green', 'yellow'];

let level = 1;

let started = false;

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
  if (started === true) {
    let userChosenColor = this.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
  }
})


function playSound(name) {
  let sound = new Audio('sounds/' + name + '.mp3');
  sound.play();
}

function animatePress(currentColor) {
  $('#' + currentColor).addClass('pressed');
  setTimeout(function() {
    $('#' + currentColor).removeClass('pressed');
  }, 100)
};

$(document).on('keydown', (e) => {
  switch (e.keyCode) {
    case 32: // spacebar
      if (started === false) {
        started = true;
        nextSequence();
        togglePointers();
      }
      break;
    case 72: // 'h' key
      if (started === false) {
        console.log('HELP!')
        $('#how-to-play').showModal();
      }
      break;
    case 65: // 'a' key
      if (started === false) {
        console.log('ABOUT');
        // $('#dialog-rounded').css('display', 'inline');
      }
      break;
    default: null
  }
});

function togglePointers() {
  $('div[type=button]').toggleClass('pointer');
};

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      level++;
      setTimeout(() => {
        $('h1').text('Level ' + level)
      }, 500)
      setTimeout(() => {
        nextSequence();
      }, 1000)
    }
  } else {
    playSound('wrong');
    togglePointers();
    $('body').addClass('game-over');
    setTimeout(() => {
      $('body').removeClass('game-over')
    }, 200)
    $('h1').html('Game Over.<br>Press Spacebar to Restart.')
    startOver();
  }
}

function startOver() {
  level = 1;
  gamePattern = [];
  started = false;
}
