
let log = document.getElementById('log')
let fon = document.getElementById('fon')
let viewText = document.getElementById("text")
let fonNext = document.getElementById('next')
let fonError = document.getElementById('error')
let a = document.getElementById('a')
let b = document.getElementById('b')
let c = document.getElementById('c')
let setSpeed = document.getElementById('setSpeed')
let getSpeed = document.getElementById('getSpeed')
let setVolume = document.getElementById("volume")
let symMin = document.getElementById('symMin')
let totalSym = document.getElementById('totalSym')
let err = document.querySelectorAll('[src^="error/e"]')
let keybord = document.getElementById('keybord')
let speedometr = document.getElementById('speedometr')
let strelka = document.querySelector('.strelka')
let posKey;
let eng = [
	[`\`~`, `1!`, `2@`, `3#`, `4$`, `5%`, `6^`, `7&`, `8*`, `9(`, `0)`, `-_`, `+=`],
	['Qq', `Ww`, `Ee`, `Rr`, `Tt`, `Yy`, `Uu`, `Ii`, `Oo`, `Pp`, `[`, `}]`, `\\|`],
	[`Aa`, `Ss`, `Dd`, `Ff`, `Gg`, `Hh`, `Jj`, `Kk`, `Ll`, `:;`, `"'`],
	[`Zz`, `Xx`, `Cc`, `Vv`, `Bb`, `Nn`, `Mm`, `<,`, `>.`, `?/`]
]
let rus = [
	[`ёЁ`, `1!`, `2"`, `3№`, `4;`, `5%`, `6:`, `7?`, `8*`, `9(`, `0)`, `-_`, `+=`],
	['йЙ', `цЦ`, `уУ`, `кК`, `еЕ`, `нН`, `гГ`, `шШ`, `щЩ`, `зЗ`, `хХ`, `ъЪ`, `\\/`],
	[`фФ`, `Ыы`, `вВ`, `аА`, `пП`, `рР`, `оО`, `лЛ`, `дД`, `жЖ`, `эЭ`],
	[`яЯ`, `чЧ`, `сС`, `мМ`, `иИ`, `тТ`, `ьЬ`, `бБ`, `юЮ`, `.,`]
];
let index = 0; 
let indexError = 0;
let flagTime = 1
let count
let error = 0;
let countError = 0;
let interval, intervalChart;
let listTimeOfValidClicks = [] // список времени когда была правельно нажата клавиша
///////////////////////////// инициализация из файла конфинг
let text = playlist.text
if (playlist.lang == "rus") posKey = rus
else posKey = eng
let sound = music()
c.innerText = text
totalSym.innerText = "всего символов: " + text.length

setVolume.onchange = () => sound.volume = setVolume.value
setSpeed.onmousedown = () => { interval = setInterval(setConfing) }
setSpeed.onmouseup = () => clearInterval(interval)

function setConfing() {
	sound.playbackRate = setSpeed.value
	getSpeed.innerHTML = sound.playbackRate.toFixed(2)
	let s = Math.floor(text.length / ((playlist.end - playlist.start) / 60) * sound.playbackRate)
	////////       кол-во символов / (            кол-во минут            ) * скорость где 1 это 100% 
	symMin.innerHTML = s + simvolMin(s)
}
let demoInter
function simvolMin(s) {
	if (s % 10 == 1) return " символ/минуту"
	if (s % 10 == 2 || s % 10 == 3 || s % 10 == 4) return " символа/минуту"
	return " символов/минуту"
}
setTimeout(()=>{
	demoInter = setInterval(()=>{
		pressDown(text[index])
	},250);
},2000)


setTimeout(()=>{
	clearInterval(demoInter); demoInter = setInterval(()=>{ pressDown(text[index])},200);
},5000)

setTimeout(()=>{
	clearInterval(demoInter); demoInter = setInterval(()=>{ pressDown(text[index])},150);
},10000)

setTimeout(()=>{
	clearInterval(demoInter); demoInter = setInterval(()=>{ pressDown(text[index])},120);
},20000)

setTimeout(()=>{
	clearInterval(demoInter); demoInter = setInterval(()=>{ pressDown(text[index])},100);
},30000)

setTimeout(()=>{
	clearInterval(demoInter); demoInter = setInterval(()=>{ pressDown(text[index])},75);
},50000)

setConfing()
showNextKey();

function music() {
	let music = document.createElement("audio")
	music.src = playlist.urlSound
	music.currentTime = playlist.start
	setVolume.value =  0.2
	music.volume = setVolume.value
	document.body.append(music)
	return music
}



function pressDown(key) {
	console.log(key);

	if (key?.length > 1) return
	if (key === text[index] || key == " " && text[index] == "\n") {
		if (flagTime) {
			count = Date.now();
			flagTime = 0;
			sound.play()
			intervalChart = setInterval(setChart, 5000);
		}
		a.innerText = text.slice(0, index + 1)
		b.innerText = text.slice(index + 1, index + 2)
		c.innerText = text.slice(index + 2, text.length)
		index++;
		listTimeOfValidClicks.push(Date.now());

		if (index >= text.length) {
			window.onkeydown = ""
			document.querySelector(`[src="tada.wav"]`).play()
			let time = Date.now() - count;
			let speedFin = Math.floor(text.length / (time / 60 / 1000))
			keybord.remove()
			speedometr.remove()
			viewText.remove();
			log.innerHTML = `<x style='color:green'>ваша скорость ${speedFin + simvolMin(speedFin)}<br></x><x style='color:red'>ошибки: ${error}</x>`
			clearInterval(demoInter);
			clearInterval(intervalChart);
			chartDraw(chartValue)
		} else {
			// дает кообдинаты клавиши на вирт.клавиатуре
			showNextKey();
		}
	}
	else {							// если клавиша с клавы не совпала с буквой из строки
		let xyError = xyKey(key, posKey)
		if (xyError) fonError.style.visibility = 'visible'
		fonError.style.left = xyError.x + "px"
		fonError.style.top = xyError.y + "px"
		countError++;
		setTimeout(() => {
			countError--
			if (countError == 0) fonError.style.visibility = "hidden"
		}, 200)
		if (indexError >= err.length) indexError = 0;
		err[indexError].play()
		indexError++
		error++;
	}
	if (key == " ") return false
}
function showNextKey() {
	let xyNext = xyKey(text.charAt(index), posKey)
	if (xyNext) {
		fonNext.style.visibility = 'visible'
		fonNext.style.left = xyNext.x + "px"
		fonNext.style.top = xyNext.y + "px"
	} else fonNext.style.visibility = "hidden"
}

function xyKey(c, posKey) {
	for (let y = 0; y < posKey.length; y++) {
		for (let x = 0; x < posKey[y].length; x++) {
			let strKey = posKey[y][x] // символ клавиши
			if (strKey.includes(c)) {
				let offsetX = 0;
				if (y == 1) offsetX = 75
				if (y == 2) offsetX = 88
				if (y == 3) offsetX = 113
				return { x: x * 50 + offsetX, y: y * 50 };
			}
		}
	}
	return 0
}

// события пауза при отставании 
let flag = true, nStop = 0, inter2;
inter2 = setInterval(() => {
	if (sound.currentTime.toFixed(1) >= playlist.stop[nStop].music) {
		if (index < playlist.stop[nStop].text - playlist.pause) sound.pause()
		else {
			sound.play();
			nStop++
			if (nStop == playlist.stop.length) clearInterval(inter2)
		}
	}
})
// спидометр
setInterval(()=>{
	let delite =false;
	listTimeOfValidClicks.forEach((value)=>{
		if (Date.now() - 3000 > value) delite = true;
	})
	if (delite) listTimeOfValidClicks.shift();
	strelka.style.transform = "translate(214px, 20px) rotate(" + (-94.5 + 0.23625 * listTimeOfValidClicks.length * 20.0) +"deg)"
})

//график
let chartValue = {labels:[], legend:[]}
let timechart = 0;
function setChart(){
	let min = timechart/60;
	let sec = timechart%60
	chartValue.labels.push("" + Math.floor(min) + ":" + sec)
	chartValue.legend.push(listTimeOfValidClicks.length * 20)
	timechart +=5;
}