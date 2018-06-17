import axios from 'axios'
import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config.js'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const queryObj = {
    ...commonParams,
    uin: 0,
    needNewCode: 1
  }

  return jsonp(url, queryObj, options)
}

export function getDiscList () {
  const url = process.env.BASE_URL + '/api/getDiscList'

  const queryObj = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: queryObj
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = process.env.BASE_URL + '/api/getCdInfo'

  const queryObj = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: queryObj
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
