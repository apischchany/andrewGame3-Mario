const MOVE_SPEED = 120
const JUMP_FORCE = 460
const BIG_JUMP_FORCE = 550
let CURRENT_JUMP_FORCE = JUMP_FORCE
const ENEMY_SPEED = 25
const FALL_DEATH = 600
let isJumping = true


layer(['obj', 'ui',], 'obj')

const maps = [
  [
  '                                             ',
  '                                             ',
  '                                             ',
  '                                             ',
  '    %      =*=%=                             ',
  '                                             ',
  '                                             ',
  '                             -+              ',
  '                  ^      ^   ()              ',
  '====xxxxxx========xxxxx=============     ====',
  ], [
  '£                              £',
  '£                              £',
  '£                              £',
  '£   ?    £££££      s          £',
  '£                 s s s        £',
  '£               s s s s s    -+£',
  '£      !      s s s s s s    ()£',
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
]]
  
  const levelCfg = {
    width: 20,
    height: 20,
    '=' : [sprite('block'), solid()],
    'x' : [sprite('brick'), solid()],
    '$' : [sprite('coin'), 'coin'],
    '%' : [sprite('question'), 'coin-surprise', solid()],
    '*' : [sprite('question'), 'mushroom-surprise', solid()],
    '}' : [sprite('unboxed'), solid()],
    '(' : [sprite('pipe-left'), solid()],
    ')' : [sprite('pipe-right'), solid()],
    '-' : [sprite('pipe-top-left-side'), solid(), 'pipe'],
    '+' : [sprite('pipe-top-right-side'), solid(), 'pipe'],
    '^' : [sprite('evil-shroom-1'), 'dangerous', solid()],
    '#' : [sprite('mushroom'), 'mushroom', body()],
    '£' : [sprite('blue-brick'), solid()],
    '!' : [sprite('blue-evil-shroom'), 'dangerous'],
    's' : [sprite('blue-steel'), solid()],
    '?' : [sprite('blue-surprise'), solid(), 'coin-surprise']
  }
  const levelIndex = args.level ?? 0
  const gameLevel = addLevel(maps[levelIndex], levelCfg)

  const scoreGlobal = args.score ?? 0
  const scoreLabel = add ([
    text(scoreGlobal),
    pos(30,6),
    layer('ui'),
    {
      value: scoreGlobal,
    }
  ])

  add ([
    text('level ' + parseInt(levelIndex + 1)),
    pos(40,6)
  ])

function big() {
  let timer = 0
  let isBig = false
  return {
    update() {
      if (isBig) {
        timer -=dt()
        if (timer <=0) {
          this.smallify()
        }
      }
    },
    isBig() {
      return isBig
    },
    smallify() {
      this.scale = vec2(1)
      timer = 0
      isBig = false
      CURRENT_JUMP_FORCE = JUMP_FORCE
    },
    biggify(time) {
      this.scale = vec2(2)
      timer = time
      isBig = true
      CURRENT_JUMP_FORCE = BIG_JUMP_FORCE
    }
  }
}


  const player = add([
    sprite('mario-standing'),
    scale(1),
    pos(30,0),
    body(),
    big(),
    origin('bot')
  ])

  player.collides('dangerous', (d) => {
    if (isJumping) {
      destroy(d)
    }
    else {
    go('lose', {score: scoreLabel.value})
    }
    })

  keyDown ('left', () => {
    player.move(-MOVE_SPEED,0)
  }) 

  keyDown ('right', () => {
    player.move(MOVE_SPEED,0)
  })

  player.action(() => {
    if(player.grounded()) {
      isJumping = false
    }
  })

  keyPress ('space', () => {
    if(player.grounded())
    isJumping = true
    player.jump(CURRENT_JUMP_FORCE)
  })

  player.on('headbump', (obj) => {
    if(obj.is('coin-surprise')) {
      gameLevel.spawn('$', obj.gridPos.sub(0,1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
    if(obj.is('mushroom-surprise')) {
      gameLevel.spawn('#', obj.gridPos.sub(0,1))
      destroy(obj)
      gameLevel.spawn('}', obj.gridPos.sub(0,0))
    }
  })

  action('mushroom', (m) => {
    m.move(20,0)
  })

  player.collides('mushroom', (m) => {
    player.biggify(6)
    destroy(m)
  })

  player.collides('coin', (c) => {
    scoreLabel.value++
    scoreLabel.text = scoreLabel.value
    destroy(c)
  })

  action('dangerous', (d) => {
    d.move(-ENEMY_SPEED,0)
  })


  player.action(() => {
    camPos(player.pos) 
    if (player.pos.y >= FALL_DEATH) {
      go('lose', {score: scoreLabel.value})
    }
  })

  player.collides('pipe', () => {
    keyDown('down', () => {
      go('main', {
        level: (levelIndex + 1) % maps.length,
        score: scoreLabel.value
      })
    })
  })