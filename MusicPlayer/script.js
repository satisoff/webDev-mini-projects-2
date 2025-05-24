const curSong = document.querySelector(".cur-song h3");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const heartBtn = document.getElementById("like");
const bHeartBtn = document.getElementById("dislike");
const shuffleBtn = document.getElementById("shuffle");
const loopBtn = document.getElementById("loop");
const volBtn = document.getElementById("vol-btn");
const volBar = document.getElementById("vol-bar");
const seekBar = document.getElementById("seekBar");
const startTime = document.querySelector(".start-time p");
const endTime = document.querySelector(".end-time p");
const addSongBtn = document.getElementById("addSongBtn");
const newSongs = document.getElementById("newSongs");
const songPlayer = document.getElementById("songPlayer");

// All Buttons
let allBtns = document.querySelectorAll(".container button, #addSongBtn");

// Select music Div-Container
const musicBox = document.querySelector(".container");

// Default settings
seekBar.value = '0';
volBar.value = '10';
songPlayer.volume = 0.1;
let thisSongDur;
let counter1=0;
let curSongIdx = 0;

// Initially disable all buttons (except Add Songs)
allBtns.forEach((item) => {
    if (item.id != "addSongBtn")
    item.disabled = true;
})

// Set up localStorage
localStorage.setItem("playing", 0);
localStorage.setItem("looping", 0);
localStorage.setItem("shuffling", 0);
localStorage.setItem("isMute", 0);

// Pop out songTitle when no song selected
function popSongTitle() {
    allBtns.forEach((item) => {
        item.addEventListener("pointerdown", () => {
            if (item.disabled==true) curSong.classList.add("popOut");
        })
        item.addEventListener("pointerup", () => {
            if (item.disabled==true) curSong.classList.remove("popOut");
        })
    })
}
popSongTitle();

// Give smooth transition to all buttons
function makeSmooth() {
    allBtns.forEach((item) => {
        if (item.disabled != true &&
            ( item.id != "loop" &&
                item.id != "shuffle"
            )
        ) {
            item.addEventListener('pointerdown', () => {
                item.classList.add("pressSmoo");
            })
        
            item.addEventListener('pointerup', () => {
                item.classList.remove("pressSmoo");
            })
        }
    })
}
makeSmooth();

// Attach Song Add button to the file input
addSongBtn.addEventListener("click", () => {
    document.getElementById("newSongs").click();
})

// Choose Now Streaming song
function playThis(idx) {
    songPlayer.src = URL.createObjectURL(newSongs.files[idx]);
    curSong.innerText = newSongs.files[idx].name;
    updSeekTime();
    playBtn.click();
}

// Update Song Name & Song playlist on any addition
newSongs.addEventListener("change", () => {
    playThis(curSongIdx);
    if (newSongs.files.length != 0) {
        allBtns.forEach((item) => {
            item.disabled = false;
        })
    }
    makeSmooth();       //Disabled change for some btns
})

// Set up play button
playBtn.addEventListener("click", () => {
    if (localStorage.getItem("playing")==0) {
        localStorage.setItem("playing", 1);
        songPlayer.play();
        playBtn.style.backgroundImage = "url('./_resources/icons8-pause-100.png')";
        musicBox.style.animation = "moveTopShadow 0.7s ease-in-out infinite alternate";
    }
    else {
        localStorage.setItem("playing", 0);
        songPlayer.pause();
        playBtn.style.backgroundImage = "url('./_resources/icons8-play-100.png')";
        musicBox.style.animation = "none";
    }
})

// Set up prev button
prevBtn.addEventListener("click", () => {
    curSongIdx-=2;
    if (curSongIdx>=-1) {
        playNext();
        playBtn.click();
    }
    return;
})

// Set up next button
nextBtn.addEventListener('click', () => {
    if (curSongIdx!=newSongs.files.length-1) {
        playNext();
        playBtn.click();
    }
})

// Set up loop button
loopBtn.addEventListener("click", () => {
    if (parseInt(localStorage.getItem("looping"))) {
        // Was looping, now it stops
        loopBtn.style.backgroundImage = "url('_resources/icons8-loop-90.png')"
        songPlayer.loop = false;
        localStorage.setItem("looping", 0);
    } else {
        // Wasn't looping, now it will
        loopBtn.style.backgroundImage = "url('_resources/icons8-loop-white-100.png')"
        songPlayer.loop = true;
        localStorage.setItem("looping", 1);
    }
})

// Set up shuffle button
shuffleBtn.addEventListener("click", () => {
    if (parseInt(localStorage.getItem("shuffling"))) {
        // Was shuffling, now it won't
        shuffleBtn.style.backgroundImage = "url('_resources/icons8-shuffle-96.png')"
        localStorage.setItem("shuffling", 0);
    } else {
        // Wasn't shuffling, now it will
        shuffleBtn.style.backgroundImage = "url('_resources/icons8-shuffle-white-100.png')";
        localStorage.setItem("shuffling", 1)
    }
})

// Set up seek timings
function updSeekTime() {
    songPlayer.addEventListener("loadedmetadata", () => {
        let songDur = songPlayer.duration;
        seekBar.value = '0';
        thisSongDur = songDur;
        let eTimeMin = parseInt(songDur / 60);
        let eTimeSec = parseInt(songDur - (eTimeMin * 60));
        startTime.innerHTML = `00:00`;
        if (eTimeMin > 9 && eTimeSec > 9) {
            endTime.innerHTML = `${eTimeMin}:${eTimeSec}`;
        } else if (eTimeMin > 9 && eTimeSec < 9) {
            endTime.innerHTML = `${eTimeMin}:0${eTimeSec}`;
        } else if (eTimeMin < 9 && eTimeSec > 9) {
            endTime.innerHTML = `0${eTimeMin}:${eTimeSec}`;
        } else {
            endTime.innerHTML = `0${eTimeMin}:0${eTimeSec}`;
        }
    });
}

// Update Seek-bar & Current-time
function calcStartTime(cTime) {
    let sTimeMin = parseInt(cTime / 60);
    let sTimeSec = parseInt(cTime - (sTimeMin * 60));
    if (sTimeMin > 9 && sTimeSec > 9) {
        startTime.innerHTML = `${sTimeMin}:${sTimeSec}`;
    } else if (sTimeMin > 9 && sTimeSec < 9) {
        startTime.innerHTML = `${sTimeMin}:0${sTimeSec}`;
    } else if (sTimeMin < 9 && sTimeSec > 9) {
        startTime.innerHTML = `0${sTimeMin}:${sTimeSec}`;
    } else {
        startTime.innerHTML = `0${sTimeMin}:0${sTimeSec}`;
    }
}

function setUpSeekBar(cTime) {
    let newSeekVal = cTime*(100/thisSongDur);
    seekBar.value = `${newSeekVal}`;
}

songPlayer.addEventListener("timeupdate", () => {
    let songCurTime = songPlayer.currentTime;
    calcStartTime(songCurTime);
    setUpSeekBar(songCurTime);
    if (songCurTime == thisSongDur) {
        playBtn.click();
        if (!parseInt(localStorage.getItem("looping"))) playNext();
    }
})

// Update song position on seek-bar change
function updSongPos(updTime) {
    songPlayer.currentTime = updTime;
}

seekBar.addEventListener("input", () => {
    let newSongPos = (seekBar.value)/(100/thisSongDur);
    updSongPos(newSongPos);
})

// Play Next Song
function playNext() {
    curSongIdx++;
    if (!(curSongIdx==newSongs.files.length)) playThis(curSongIdx);
    console.log(curSongIdx);
    return;
}

// Set up volume Bar
function updSongVol(newVol) {
    songPlayer.volume = newVol;
}

volBar.addEventListener("input", () => {
    let curVol = volBar.value;
    updSongVol(curVol/100);
    if (curVol == 0) {
        volBtn.style.backgroundImage = "url('./_resources/icons8-no-audio-100.png')";
    } else {
        volBtn.style.backgroundImage = "url('./_resources/icons8-volume-100.png')";
    }
})
volBtn.addEventListener("click", () => {
    if (parseInt(localStorage.getItem("isMute"))) {
        // Not muted, now going to mute
        volBtn.style.backgroundImage = "url('./_resources/icons8-volume-100.png')";
        songPlayer.volume = parseInt(localStorage.getItem("isMute"))/100;
        volBar.value = songPlayer.volume*100;
        localStorage.setItem("isMute", 0);
    } else {
        // Already muted, going to unmute
        volBtn.style.backgroundImage = "url('./_resources/icons8-no-audio-100.png')";
        localStorage.setItem("isMute", songPlayer.volume*100);
        songPlayer.volume = 0;
        volBar.value = 0;
    }
})