//Matthew 6:33 But seek ye first the kingdom of God and His rightousness and all this things shall be added unto you.
const timerTime = $('#timer-time');
const setBtn = $('#set');
const repeatBtn = $('#repeat');
const stopBtn = $('#stop');
const muteBtn = $('#mute');
const alarm = $('#alarm-sound')[0];
const countdown = $('#countdown');
const endMenu = $('#settings');
const body = $('body');
const stopTimerBtn = $('#stop-btn');
const stopTimerDiv = $('.stop-timer');
const resetBtn = $('#reset-btn');

countdown.html('0min : 0sec')

let times = [];
let buttonClicked = false;
let count = 0;
stopTimerBtn.on('click', function() {
    count++;
    resetBtn.removeClass('hidden');
    buttonClicked = true;
    if (buttonClicked && count % 2 === 0) {
        stopTimerBtn.attr('disabled', true);
        setTimeout(function(){
            stopTimerBtn.attr('disabled', false);
        }, 1000)
        resetBtn.addClass('hidden');
        timer(Number(times[0]));
    }
});


const timer = (time) => {
    let wakeLock = null;

    const requestWakeLock = async () => {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock activated.');
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    requestWakeLock();
    stopTimerDiv.removeClass('hidden');
    stopTimerBtn.text('Stop Timer');
    setBtn.addClass('hidden');
    body.toggleClass('background');
    setBtn.attr('disabled', true);
    timerTime.attr('disabled', true);
    timeLeft = Math.trunc(time * 60);
    var min = Math.floor(timeLeft/60)
    var sec = timeLeft % 60;
    countdown.html(`${min}min : ${sec}sec`);
        var timerInterval = setInterval( function UpdateCountdown(){
            var newDuration = timeLeft - 1;
            min = Math.floor(newDuration/60)
            sec = newDuration % 60;
            timeLeft = newDuration;       
            countdown.html(`${min}min : ${sec}sec`);
            let newTimeLeft = timeLeft / 60;
    if (buttonClicked && count % 2 === 1) {
        let stopMin = min;
        let stopSec = sec;
        countdown.html(`${stopMin}min : ${stopSec}sec`);
        clearInterval(timerInterval); 
        paused = true;
        stopTimerBtn.text('Continue');
        times[0] = newTimeLeft;
        return;
    }
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        endMenu.toggleClass('hidden');
        endMenu.toggleClass('d-flex');
        alarm.play();
        alarm.currentTime = 0;
        muteBtn.text('Silence');
        const releaseWakeLock = async () => {
            if (wakeLock !== null) {
                try {
                    await wakeLock.release();
                    console.log('Wake Lock released.');
                } catch (err) {
                    console.error(`${err.name}, ${err.message}`);
                }
            }
        };
        
        releaseWakeLock();
    }
}, 1000);
};

$(document).on('click', function(event) {
    if (!$(event.target).closest(endMenu).length) {
        endMenu.addClass('hidden');
    }
});
muteBtn.on ('click', () => {
    alarm.pause();
    alarm.currentTime = 0;
    muteBtn.text('Silenced');
    muteBtn.toggleClass('silenced');
});

repeatBtn.on ('click', () => {
    let OgTime = timerTime.val();
    timer(OgTime);
    alarm.pause();
    endMenu.toggleClass('hidden');
    endMenu.toggleClass('d-flex');
    muteBtn.text('Silence');
});
resetBtn.on('click', () => {
    setBtn.attr('disabled', false);
    timerTime.attr('disabled', false);
    timerTime.val('');
    times.splice(0, times.length);
    stopTimerDiv.addClass('hidden');
    setBtn.removeClass('hidden');
    countdown.html(' 0min : 0sec');
});
stopBtn.on('click', () => {
    endMenu.toggleClass('hidden');
    endMenu.toggleClass('d-flex');
    alarm.pause();
    setBtn.attr('disabled', false);
    timerTime.attr('disabled', false);
    timerTime.val('');
    muteBtn.text('Silence');
    const releaseWakeLock = async () => {
        if (wakeLock !== null) {
            try {
                await wakeLock.release();
                console.log('Wake Lock released.');
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        }
    };
    
    releaseWakeLock();    
});
setBtn.on('click', () => {
    timer(timerTime.val());
});

timerTime.attr('disabled', false)
setBtn.attr('disabled', false);
timerTime.keypress(function(event){
    if(event.key === 'Enter'){
        timer(timerTime.val());
    }
});
