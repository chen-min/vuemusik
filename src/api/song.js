import { commonParams } from './config'
import axios from 'axios'
import { getUid } from 'common/js/uid'

export function getSongsUrl (songs) {
  const url = process.env.BASE_URL + '/api/getPurlUrl'
  let mids = []
  let types = []

  songs.forEach(song => {
    mids.push(song.mid)
    types.push(0)
  })

  const queryObj = {
    ...commonParams,
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  }

  return axios.post(url, {
    comm: queryObj,
    url_mid: getUrlMid(mids, types)
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

function getUrlMid (mids, types) {
  const guid = String(getUid())
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}

export function getLyric (mid) {
  const url = process.env.BASE_URL + '/api/lyric'

  const queryObj = {
    ...commonParams,
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  }

  return axios.get(url, {
    params: queryObj
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
