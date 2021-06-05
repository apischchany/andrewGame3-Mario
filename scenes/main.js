const MOVE_SPEED = 120
const JUMP_FORCE = 460

layer(['obj', 'ui',], 'obj')


const map = [
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
  ]
  const levelCfg = {
    width: 20,
    height: 20,
    '=' : [sprite('block'), solid()],
    'x' : [sprite('brick'), solid()],
    '$' : [sprite('coin')],
    '%' : [sprite('question'), 'coin-surprise', solid()],
    '*' : [sprite('question'), 'mushroom-surprise', solid()],
    '}' : [sprite('unboxed'), solid()],
    '(' : [sprite('pipe-left'), solid()],
    ')' : [sprite('pipe-right'), solid()],
    '-' : [sprite('pipe-top-left-side'), solid()],
    '+' : [sprite('pipe-top-right-side'), solid()],
    '^' : [sprite('evil-shroom-1')],
    '#' : [sprite('mushroom'), 'mushroom', body()],
  }
  
  const gameLevel = addLevel(map, levelCfg)

  const scoreLabel = add ([
    text('0'),
    pos(30,6),
    layer('ui'),
    {
      value: '0',
    }
  ])

  add ([
    text('level ' + '0'),
    pos(40,6)
  ])

  function big() {
    let timer = 0
    let isBig = false
    return {
      update() {
        if (isBig) {
          timer -=dt()
          if (timer <=0){
            this.smallify()
          }
        }
      }
    }
  }

  const player = add([
    sprite('mario-standing'),
    scale(1.5),
    pos(30,0),
    body()
  ])



  keyDown ('left', () => {
    player.move(-MOVE_SPEED,0)
  }) 

  keyDown ('right', () => {
    player.move(MOVE_SPEED,0)
  })

  keyPress ('space', () => {
    if(player.grounded())
    player.jump(JUMP_FORCE)
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