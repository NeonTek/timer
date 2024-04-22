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

countdown.html('0min : 0sec')

const timer = () => {
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
    body.toggleClass('background')
    setBtn.attr('disabled', true);
    timerTime.attr('disabled', true);
    timeLeft = Math.trunc(timerTime.val() * 60);
    var min = Math.floor(timeLeft/60)
    var sec = timeLeft % 60;
    countdown.html(`${min} min : ${sec}sec`);
        var timerInterval = setInterval( function UpdateCountdown(){
            var newDuration = timeLeft - 1;
            min = Math.floor(newDuration/60)
            sec = newDuration % 60;
            timeLeft = newDuration;       
            countdown.html(`${min} min : ${sec}sec`);

    if (timeLeft === 0) {
        clearInterval(timerInterval);
        alarm.play();
        endMenu.toggleClass('hidden');
        endMenu.toggleClass('d-flex');
        body.toggleClass('background');
    }
    ;
}, 1000)
}

muteBtn.on ('click', () => {
    alarm.pause();
    alarm.currentTime = 0;
    muteBtn.text('Silenced');
    alarm.toggleClass('silenced');
});

repeatBtn.on ('click', () => {
    timer();
    alarm.pause();
    endMenu.toggleClass('hidden');
    endMenu.toggleClass('d-flex');
    muteBtn.text('Silence');
});
stopBtn.on('click', () => {
    endMenu.toggleClass('hidden');
    endMenu.toggleClass('d-flex');
    alarm.pause();
    setBtn.attr('disabled', false);
    timerTime.attr('disabled', false);
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
})
setBtn.on('click', timer);

timerTime.attr('disabled', false)
setBtn.attr('disabled', false);


