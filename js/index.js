var musicList = []
var currentIndex = 0
var clock
var audio = new Audio()
audio.autoplay =true;

getMusicList(function(list){
 musicList = list
 loadMusic(list[currentIndex])
 generateList(list)
//  加载音乐
})
// 执行getMusicList这个函数就是执行下面的function getMusicList(callback){..函数

audio.ontimeupdate = function(){
  // console.log(this.currentTime)
  $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%'
}

audio.onplay = function(e){
  // console.log(this.currentTime)
  clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime)%60 + ''
    // console.log(min,sec)
    sec = sec.length === 2? sec: '0'+ sec
    $('.musicbox .time').innerText = min + ':' + sec
  },1000)
 for(var key in musicList){
  if(musicList[key].src===e.path[0].src){
   $('.list').children[key].classList.add('listcover')
  }else{
   $('.list').children[key].classList.remove('listcover')
  }
}
}

audio.onpause = function(){
    clearInterval(clock)
}

audio.onended = function(){
  console.log('ended')
  currentIndex = (++currentIndex)%musicList.length
  loadMusic(musicList[currentIndex])

}

$('.musicbox .icon-play').onclick = function(){
   if(audio.paused){
    audio.play()
    this.classList.remove('icon-play')
    this.classList.add('icon-zanting')
   }else {
    audio.pause()
    this.classList.remove('icon-zanting')
    this.classList.add('icon-play')
   }
}

$('.musicbox .icon-xiayiqu').onclick = function(){
   currentIndex = (++currentIndex)%musicList.length
   console.log(currentIndex)
   loadMusic(musicList[currentIndex])
//是下面声明的一个函数，修改内容和src
}

$('.musicbox .icon-back').onclick = function(){
  currentIndex = (musicList.length + --currentIndex)%musicList.length
  console.log(currentIndex)
  loadMusic(musicList[currentIndex])
//是下面声明的一个函数，修改内容和src
}

$('.musicbox .bar').onclick = function(e){
  console.log(e)
  // 用来看e的属性，有offsetX
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  // parseInt转化成整数
  console.log(percent)
  audio.currentTime = audio.duration * percent
}

function $(selector){
  return document.querySelector(selector)
}

function getMusicList(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('GET','https://bozi4444.github.io/bobo44/music.json',true)
    xhr.onload = function(){
      if((xhr.status >= 200 && xhr.status < 300 )||xhr.status === 304){
        callback(JSON.parse(this.responseText))
    //  代码可以不用放这里，而是放到上面的getMusicList（）中
      }else{
        console.log('获取数据失败')
      }
    }
    xhr.onerror = function(){
      console.log('网络异常')
    }
    xhr.send()
    // 发请求，如请求正确那么执行这个参数，把参数当作函数去调用，把所得的后面的json。。参数传递到函数里。
    // 所以数据到来后，就会执行function（list）..这个函数。json。。就是list参数。
}


function loadMusic(musicObj){
    console.log('beigin play',musicObj)
    $('.musicbox .title').innerText = musicObj.title
    $('.musicbox .auther').innerText = musicObj.auther
    $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')'
    audio.src = musicObj.src
}

function generateList(list){
    $('.list>:first-child').innerText = list[currentIndex].auther + '-' + list[currentIndex].title
    $('.list>:last-child').innerText = list[currentIndex+1].auther + '-' + list[currentIndex+1].title
}
$('ul').addEventListener('click',function(e){
    
    for(key in musicList){
      console.log(musicList[key].title,e.target.innerText)
      if(e.target.innerText.search(musicList[key].title)>-1){
        currentIndex = key
        loadMusic(musicList[currentIndex])
      }
    }
})