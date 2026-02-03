// Spotify Clone - simple, professional audio player
document.addEventListener('DOMContentLoaded', ()=>{
	const audio = document.getElementById('audio')
	const btnPlay = document.getElementById('btnPlay')
	const btnNext = document.getElementById('btnNext')
	const btnPrev = document.getElementById('btnPrev')
	const btnShuffle = document.getElementById('btnShuffle')
	const btnRepeat = document.getElementById('btnRepeat')
	const volume = document.getElementById('volume')
	const progress = document.getElementById('progress')
	const progressContainer = document.getElementById('progressContainer')
	const currentTimeEl = document.getElementById('currentTime')
	const durationEl = document.getElementById('duration')
	const titleEl = document.getElementById('title')
	const artistEl = document.getElementById('artist')
	const coverEl = document.getElementById('cover')
	const tracksListEl = document.getElementById('tracks')

	// Playlist: replace src and cover files with your own files in assets/Music and assets/Images
	const songs = [
		{name:'Bade_Miyan_Chote_Miyan_-',artist:'Vishal Dadlani',src:'assets/Music/Bade_Miyan_Chote_Miyan_-.mp3',cover:'assets/Images/cover 1.jpg',duration:'2:49'},
		{name:'Song Two',artist:'Artist B',src:'assets/Music/song2.mp3',cover:'assets/Images/cover2.jpg'},
		{name:'Song Three',artist:'Artist C',src:'assets/Music/song3.mp3',cover:'assets/Images/cover3.jpg'}
	]

	let currentIndex = 0
	let isPlaying = false
	let isShuffled = false

	function createTrackList(){
		tracksListEl.innerHTML = ''
		songs.forEach((s, i)=>{
			const li = document.createElement('li')
			li.className = 'track'
			li.dataset.index = i
			li.innerHTML = `
				<img class="track-cover" src="${s.cover}" alt="cover" />
				<div class="meta">
					<div class="name">${s.name}</div>
					<div class="artist">${s.artist}</div>
				</div>
				<div class="duration">--:--</div>
			`
			li.addEventListener('click', ()=>{loadTrack(i); playTrack()})
			tracksListEl.appendChild(li)
		})
	}

	function loadTrack(index){
		const s = songs[index]
		currentIndex = index
		audio.src = s.src
		titleEl.textContent = s.name
		artistEl.textContent = s.artist
		coverEl.src = s.cover
		document.querySelectorAll('.track').forEach(t=>t.classList.remove('active'))
		const active = document.querySelector(`.track[data-index='${index}']`)
		if(active) active.classList.add('active')
	}

	function playTrack(){
		audio.play().then(()=>{
			isPlaying = true
			btnPlay.textContent = '⏸'
		}).catch(err=>console.warn(err))
	}

	function pauseTrack(){
		audio.pause()
		isPlaying = false
		btnPlay.textContent = '▶'
	}

	function togglePlay(){
		isPlaying ? pauseTrack() : playTrack()
	}

	function prevTrack(){
		if(audio.currentTime>3){ audio.currentTime = 0; return }
		if(isShuffled) return playRandom()
		currentIndex = (currentIndex-1 + songs.length) % songs.length
		loadTrack(currentIndex)
		playTrack()
	}

	function nextTrack(){
		if(isShuffled) return playRandom()
		currentIndex = (currentIndex+1) % songs.length
		loadTrack(currentIndex)
		playTrack()
	}

	function playRandom(){
		const idx = Math.floor(Math.random()*songs.length)
		loadTrack(idx)
		playTrack()
	}

	function updateProgress(){
		if(!audio.duration) return
		const percent = (audio.currentTime/audio.duration)*100
		progress.style.width = percent + '%'
		currentTimeEl.textContent = formatTime(audio.currentTime)
		durationEl.textContent = formatTime(audio.duration)
	}

	function setProgress(e){
		const rect = progressContainer.getBoundingClientRect()
		const x = e.clientX - rect.left
		const pct = x / rect.width
		audio.currentTime = pct * audio.duration
	}

	function formatTime(sec){
		if(isNaN(sec)) return '0:00'
		const m = Math.floor(sec/60)
		const s = Math.floor(sec%60).toString().padStart(2,'0')
		return `${m}:${s}`
	}

	function toggleShuffle(){
		isShuffled = !isShuffled
		btnShuffle.style.color = isShuffled ? 'var(--accent)' : ''
	}

	function toggleRepeat(){
		audio.loop = !audio.loop
		btnRepeat.style.color = audio.loop ? 'var(--accent)' : ''
	}

	function setVolume(v){ audio.volume = v }

	// events
	btnPlay.addEventListener('click', togglePlay)
	btnNext.addEventListener('click', nextTrack)
	btnPrev.addEventListener('click', prevTrack)
	btnShuffle.addEventListener('click', toggleShuffle)
	btnRepeat.addEventListener('click', toggleRepeat)
	volume.addEventListener('input', e=>setVolume(e.target.value))
	audio.addEventListener('timeupdate', updateProgress)
	audio.addEventListener('ended', ()=>{ if(!audio.loop) nextTrack() })
	progressContainer.addEventListener('click', setProgress)

	// keyboard support
	document.addEventListener('keydown', e=>{
		if(e.code==='Space') { e.preventDefault(); togglePlay() }
		if(e.code==='ArrowRight') nextTrack()
		if(e.code==='ArrowLeft') prevTrack()
	})

	// initialize
	createTrackList()
	loadTrack(0)
	setVolume(volume.value)
})
