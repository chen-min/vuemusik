<template>
  <div class="player" v-show="playlist.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @afterLeave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" >
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h1 class="subtitle" v-html="currentSong.singer"></h1>
        </div>
          <!--旋转的唱片-->      
        <div class="middle">
          <!-- 旋转的唱片 -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class='cd' :class="cdCls">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
          </div>
  <!--         <div class="playing-lyric-wrapper">
            <div class="playing-lyric"></div>
          </div> -->
  <!--         <scroll>
            <div class="lyric-wrapper">
              <div>
                <p></p>
              </div>
            </div>
          </scroll> -->
        </div>

        <!-- 底部操作区域 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow == 'cd'}"></span>
            <span class="dot" :class="{active: currentShow == 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l"> {{format(currentTime)}} </span>s
            <div class="progress-bar-wrapper">
              <progress-bar>
              </progress-bar>
            </div>
            <span class="time time-r"> {{ format(currentSong.duration) }} </span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <i :class="modeIcon"></i>
            </div>
            <div class="icon icon-left" :class='disableCls'>
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon icon-center" :class='disableCls'>
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon icon-right" :class='disableCls'>
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
     
    <transition name-"mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">

        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio 
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @timeupdate="updateTime"
      >
    </audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import Scroll from 'base/scroll/scroll'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
const transform = prefixStyle('transform')
import ProgressBar from 'base/progress-bar/progress-bar'


export default {
  components: {
    ProgressBar,
  },
  data() {
    return {
      songReady:false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play-mini'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    modeIcon () {
      switch (this.mode) {
        case playMode.random: return 'icon-random'
        case playMode.loop: return 'icon-loop'
        case playMode.sequence:
        default: return 'icon-sequence'
      }
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
    ]),
  },
  watch: {
      currentSong (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          retrun
        }
        setTimeout(() => {
          this.$refs.audio.play()
        }, 1000)
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    togglePlaying () {
      if (!this.songReady) {
        return 
      }
      console.log("togglepLAYING")
      this.setPlayingState (!this.playing)
    },
    prev () {
      if (!this.songReady) {
        return 
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length-1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    next () {
      if (!this.songReady) {
        return 
      }
      let index = this.currentIndex +1
      if (index === this.playlist.length) {
        index = 0 
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },

    ...mapMutations({
      setFullScreen : 'SET_FULLSCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYlIST'
    }),
    format(interval) {
      interval = interval | 0 ;
      const minute = interval /60  | 0 
      const second = interval %60
      return `${minute}::${this._pad(second)}`

    },
    _pad (num, n=2) {
      let len = num.toString().length
      while(len < 2) {
        num = '0' + num
        len ++
      }
      return num
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale () {
      const miniWidth = 40
      const miniX = miniWidth / 2 + 20
      const miniY = window.innerHeight - miniWidth / 2 - 10
      const normalWidth = window.innerWidth / 2
      const normalX = normalWidth
      const normalY = normalWidth * 0.8 / 2 + 80
      // 以上坐标以屏幕左上角为原点计算

      const scale = miniWidth / normalWidth
      const x = -(normalX - miniX) // cdWrapper是最终的状态， 其位置相当于原点， 所以是负的
      const y = miniY - normalY

      return {
        scale,
        x,
        y
      }
    },

    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
    })
  }
  

}
</script>

<style lang="stylus">
.player
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background
    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)
    .top
      position: relative
      margin-bottom: 25px
      .back
        position: absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
          display: inline-block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)
      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text
      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%
        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%
          .cd
            width: 100%
            height: 100%
            // 歌曲图片旋转
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              box-sizing: border-box
              border-radius: 50%
              border: 10px solid rgba(255, 255, 255, 0.1)
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
      .middle-r
        display: inline-block
        vertical-align: top
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 auto
          overflow: hidden
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      position: absolute
      bottom: 50px
      width: 100%
      .dot-wrapper
        text-align: center
        font-size: 0
        .dot
          display: inline-block
          vertical-align: middle
          margin: 0 4px
          width: 8px
          height: 8px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0px auto
        padding: 10px 0
        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px
          &.time-l
            text-align: left
          &.time-r
            text-align: right
        .progress-bar-wrapper
          flex: 1
      .operators
        display: flex
        align-items: center
        .icon
          flex: 1
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .icon-left
          text-align: right
        .icon-center
          padding: 0 20px
          text-align: center
          i
            font-size: 40px
        .icon-right
          text-align: left
    // 过渡
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity: 0
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, 100px, 0)
  // 迷你播放器
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px
      img
        border-radius: 50%
        &.play
          animation: rotate 10s linear infinite
        &.pause
          animation-play-state: paused
    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden
      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text-d
      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d
    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px
      .icon-playlist, .icon-play-mini, .icon-pause-mini
        font-size: 30px
        color: $color-theme-d
      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0
// 旋转动画
@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
