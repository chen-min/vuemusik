<template>
  <div class="player" v-show="playlist.length > 0">
    <transition>
      <div class="normal-player">
        <div class="background">
          <img src="" alt="">
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back"></i>
          </div>
            <h1 class="title"></h1>
            <h1 class="subtitile"></h1>
        </div>
          <!--旋转的唱片-->      
        <div class="middle">
          <div class="middle-l">
            <div class="cd">
              <img src="" alt="" class="imagje">
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
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l"></span>
            <div class="progress-bar-wrapper">
              
            </div>
            <span class="time time-r"></span>
          </div>
          <div class="operators">
            <div class="icon icon-left">
              <i class="modeIcon"></i>
            </div>
            <div class="icon icon-left">
              <i class="modeIcon"></i>
            </div>
            <div class="icon icon-left">
              <i class="modeIcon"></i>
            </div>
            <div class="icon icon-left">
              <i class="modeIcon"></i>
            </div>
            <div class="icon icon-left">
              <i class="modeIcon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition>

    </transition>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import Scroll from 'base/scroll/scroll'

export default {
  
  components: {
  },

  computed: {
    ...mapGetters([
        'playlist',
    ]),
  },
  methods: {
    ...mapMutations({
    }),
  },
  

}
</script>

<style lang="stylus">
.player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 100


</style>
