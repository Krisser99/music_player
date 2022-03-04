

/**
 * 1. Render Song
 * 2. Scroll top
 * 3. Play / Pause / Seek
 * 4. CD rotate
 * 5. Next/ Prev
 * 6. Random
 * 7. Next / Repeat Song when end
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const header = $('.player h2');
const cdThums = $('.cd-thumb');
const audio = $('#audio');
const btnPlay = $('.controls-btn-toggleplay');
const play = $('.player');
const propress = $('#progress');
const btnNext = $('.controls-btn-next');
const btnPrev = $('.controls-btn-prev');
const btnRandom = $('.controls-btn-random');
const btnRepeat = $('.controls-btn-repeat');
const playList = $('.playlist');

const app = {
    currentIndex: 0,

    isPlaying: false,

    isRandom: false,

    isRepeat: false,

    songs: [
        {
            name: 'Cheap Thrills',
            singer: 'Sia',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Past Lives',
            singer: 'Sapientdream',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Love Me Like You Do',
            singer: 'Ellie Goulding',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'It Aint Me',
            singer: 'Kygo ft. Selena Gomez',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Infinity',
            singer: 'Jaymes Young',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Industry Baby',
            singer: 'Lil Nas X Jack Harlow',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Holiday',
            singer: 'Lil Nas X',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Genius',
            singer: 'Labrinth, Sia & Diplo present LSD',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Dusk Till Dawn',
            singer: 'Zayn ft. Sia',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Deathbed',
            singer: 'Powfu ft. beabadoobee',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}');"></div>
                <div class="body">
                    <h5 class="title">${song.name}</h5>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="options">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        });

        playList.innerHTML = htmls.join('')
        
    },
    
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },


    handleEvents: function() {
        const _this = this;
        // CD rotate
        const cdAnimation = cdThums.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimation.pause();
        // Scroll Top
        const cdWidth = cd.offsetWidth;

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = Math.floor(newCdWidth) > 0 ? Math.floor(newCdWidth) + 'px': 0;
            cd.style.opacity = Math.floor(newCdWidth)/cdWidth;
        }
        // Play / Pause Song
        btnPlay.onclick = function() {

            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }   
        // Song play
        audio.onplay = function() {
            _this.isPlaying = true;
            play.classList.add('playing')
            cdAnimation.play();
        }
        // Song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            play.classList.remove('playing')
            cdAnimation.pause();
        }
        // Update real time song playing
        audio.ontimeupdate = function() {
            const totalTimeCurrentSong = audio.duration;
            const timeCurrentSong = Math.floor(audio.currentTime);
            if(totalTimeCurrentSong) {
                propress.value = (timeCurrentSong*100)/totalTimeCurrentSong;
            }
        }
        // Seek song 
        propress.onchange = function(e) {
            const seeked = (e.target.value*audio.duration)/100;
            audio.currentTime = seeked;

        }

        propress.onmousedown = function() {
            audio.pause();
        } 

        propress.onmouseup = function() {
            audio.play();
        } 
        // Next Song
        btnNext.onclick = function() {
            if(_this.isRandom) {
                _this.radomSong();
            }else {
                _this.nextSong();
            }
            _this.render();
            audio.play();
            _this.songIntoView();
        }
        // Prev Song
        btnPrev.onclick = function() {
            if(_this.isRandom) {
                _this.radomSong();
            }else{
                _this.prevSong();
            }
            _this.render();
            audio.play();
            _this.songIntoView();
        }
        // Random Song
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom;
            btnRandom.classList.toggle('active', _this.isRandom);
        }
        // Next song when end
        audio.onended = function() {
            btnNext.click();
        }
        // Repeat song when end
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            btnRepeat.classList.toggle('active', _this.isRepeat)
            _this.repeatSong();
        }
        // Play song when click 
        playList.onclick = function(e) {
            const songTarget = e.target.closest('.song:not(.active)');

            if(songTarget || e.target.closest('.options')) {
                if(songTarget) {
                    _this.currentIndex = Number(songTarget.dataset.index);
                    _this.render();
                    _this.loadCurrentSong()
                    audio.play();
                }
            }
        }

    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },

    radomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random()*this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    repeatSong: function() {
        if(this.isRepeat) {
            audio.loop = true;
        } else {
            audio.loop = false;
        }
    },
    
    songIntoView: function() {
        setTimeout(() => {
            if(this.currentIndex === 1 || 2 || 3) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }else{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }, 200)
    },

    loadCurrentSong: function() {
        header.textContent = this.currentSong.name;
        cdThums.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;   

    },
    
 
    start: function() {

        this.defineProperties();

        this.loadCurrentSong();

        this.handleEvents();

        this.render();

    },
}

app.start();



