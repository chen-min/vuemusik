<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters(['singer'])
  },
  created () {
    this._getDetail(this.singer.mid)
  },
  methods: {
    _getDetail (mid) {
      if (!mid) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(mid).then(res => {
        if (res.code === ERR_OK) {
          processSongUrl(this._normalizeSongs(res.data.list))
            .then(songs => {
              this.songs = songs
            })
        }
      })
    },
    _normalizeSongs (list) {
      let res = []
      list.forEach(item => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
          res.push(createSong(musicData))
        }
      })

      return res
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>