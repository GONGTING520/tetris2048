var instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = '/static/audio/bgm2.mp3'

    this.mergeAudio = new Audio()
    this.mergeAudio.src = '/static/audio/merge.mp3'

    this.levelUpAudio = new Audio()
    this.levelUpAudio.src = '/static/audio/levelup.mp3'

    // this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playMergeBgm() {
    this.mergeAudio.pause()
    this.mergeAudio.currentTime = 0
    this.mergeAudio.play()
  }

  playLevelUpBgm() {
    this.levelUpAudio.currentTime = 0
    this.levelUpAudio.play()
  }
}
