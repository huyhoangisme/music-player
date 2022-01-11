// define variable
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const body = $('body');
const playList = $('.playlist');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const playIcon = $('.icon-pause');
const CdThumb = $('.cd-thumb');
const progress = $('#progress');
const timeDuration = $('.right-time span');
const nextSong = $('.btn-next');
const prevSong = $('.btn-prev');
const randomSong = $('.btn-random');
const repeatSong = $('.btn-repeat');
let duration = 0;
const app = {
    indexCurrentSong: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    arrayRandom: [],
    songs: [
        {
            name: 'Bước qua nhau',
            singer: 'Vũ',
            path: './assets/music/BuocQuaNhau-Vu.mp3',
            thumb: './assets/images/buocquanhau.jpg'
        },
        {
            name: 'Cưới thôi',
            singer: 'Masew',
            path: 'assets/music/CuoiThoi.mp3',
            thumb: './assets/images/cuoithoi.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: 'assets/music/MuonRoiMaSaoCon.mp3',
            thumb: './assets/images/muonroimasaocon.jpg'
        },
        {
            name: 'Sài gòn đau lòng quá',
            singer: 'Huy Hoàng',
            path: 'assets/music/SaiGonDauLongQua.mp3',
            thumb: './assets/images/saigondaulongqua.jpg'
        },
        {
            name: 'Thức Giấc',
            singer: 'DaLab',
            path: 'assets/music/ThucGiac.mp3',
            thumb: './assets/images/thucgiac.jpg'
        },

    ],
    render: function () {
        htmls = this.songs.map((song, index) => {

            return `
                <div class="song ${(index === this.indexCurrentSong) ? 'active' : ''}"data-index="${index}">
                <div class="thumb">
                    <img src="${song.thumb}" alt="">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');

    },
    handleEvent: function () {
        // xử lí khi click nút play
        const _this = this;
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
                CdThumAnimate.pause();
            } else {
                audio.play();
                CdThumAnimate.play();
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            playIcon.classList.add('fa-pause', 'active');
            playIcon.classList.remove('fa-play');

        }
        audio.onpause = function () {
            _this.isPlaying = false;
            playIcon.classList.remove('fa-pause', 'active');
            playIcon.classList.add('fa-play');

        }
        // CD rotate
        const CdThumAnimate = CdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        CdThumAnimate.pause();
        // Xử lí phần Seek
        audio.ontimeupdate = function () {
            let seekTime = Math.floor((audio.currentTime / audio.duration) * 100);
            if (seekTime) {
                progress.value = seekTime;
            } else {
                progress.value = 0;
            }
            _this.updateTimeSong(audio.currentTime);
            _this.timeDuration(audio.duration);
        }
        progress.oninput = function () {
            const newCurrentTime = ((progress.value * audio.duration) / 100);
            audio.currentTime = newCurrentTime;

        }

        // xử lí khi click next bài hát
        nextSong.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else _this.nextSong();
            audio.play();
            _this.scrollIntoViewActive();
        }
        // xử lí khi click vào prev bài hát
        prevSong.onclick = function () {
            _this.prevSong();
            audio.play();
            _this.scrollIntoViewActive();
        }
        // xử lí khi click vào nút random bài hát
        randomSong.onclick = function () {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle("active", _this.isRandom);

        }
        // xử lí khi click vào nút repeat bài hát
        repeatSong.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("active", _this.isRepeat);
        }
        // Xử lí next bài hát khi bài hát kết thúc.
        audio.onended = function () {
            if (_this.isRepeat) {
                _this.repeatSong();
            } else {
                nextSong.click();
            }

        }
        // Xử lí khi click vào chọn bài hát
        playList.onclick = function (event) {
            const clickSong = event.target.closest('.song:not(.active)');
            // console.log(event.target.closest('.option'))
            if (clickSong && !event.target.closest('.option')) {
                _this.indexCurrentSong = parseInt(clickSong.getAttribute('data-index'));
                _this.chooseSong();
            } else if (event.target.closest('.option')) {
                console.log(event.target.closest('.option'))
            }
        }
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.indexCurrentSong];
            }
        })
    },
    nextSong: function () {
        this.indexCurrentSong++;
        if (this.indexCurrentSong >= this.songs.length) this.indexCurrentSong = 0;
        this.loadSong();
        this.render();
    },
    prevSong: function () {
        this.indexCurrentSong--;
        if (this.indexCurrentSong < 0) this.indexCurrentSong = this.songs.length - 1;
        this.loadSong();
        this.render();
    },
    loadSong: function () {
        $('.infor__song h2').innerHTML = this.currentSong.name;
        $('.infor__song h4').innerHTML = this.currentSong.singer;
        $('.cd-thumb img').src = this.currentSong.thumb;
        audio.src = this.currentSong.path;
    },
    randomSong: function () {
        let newCurrentIndex = 0;
        do {
            newCurrentIndex = Math.floor(Math.random() * this.songs.length);
        } while (newCurrentIndex === this.indexCurrentSong);
        this.indexCurrentSong = newCurrentIndex;
        //    console.log(newCurrentIndex,this.indexCurrentSong) ;
        this.loadSong();
        this.render();
    },
    repeatSong: function () {
        audio.play();
    },
    scrollIntoViewActive: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start'
            })
        }, 200);
    },
    chooseSong: function () {
        this.loadSong();
        this.render();
        this.scrollIntoViewActive();
        audio.play();
    },
    updateTimeSong: function (value) {
        const leftTimeAudio = $('.left-time span');
        if (value !== undefined) {
            let second = parseInt(value % 60);
            let minute = parseInt(value / 60);
            setInterval(this.updateDuration, 1000);
            if (second < 10) second = '0' + second;
            if (minute < 60) minute = '0' + minute;
            leftTimeAudio.innerHTML = `${minute}:${second}`
        }
    },
    timeDuration: function (value) {
        let second = parseInt(value % 60);
        let minute = parseInt(value / 60);
        if (value !== undefined || value !== NaN) {
            if (second < 10) second = '0' + second;
            if (minute < 60) minute = '0' + minute;
        }
        else {
            second = 0;
            minute = 0;
        }
        timeDuration.innerHTML = `${minute}:${second}`
    },
    start: function () {
        this.defineProperties();
        this.handleEvent();
        this.render();
        this.loadSong();

    },
}

app.start();

