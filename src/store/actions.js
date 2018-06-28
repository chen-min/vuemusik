import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from '../common/js/util'

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

