import { useEffect, useState } from 'react'
import './App.css'
import { Matrix, MatrixProps } from './components/Matrix'
import { ITetrimino, T, Z, S, J, L, I, O } from './components/Tetrimino'
import { v4 as uuidv4 } from 'uuid'
import { AnimatePresence, motion } from 'framer-motion'
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid'

const generateUUIDv4 = (): string => {
  return uuidv4()
}

const X = 10
const Y = 14
const mobileWidth = [640]
const themes = ["coffee", "retro", "cyberpunk", "graden", "aqua", "dark", "cmyk"]

export const App = () => {
  const [deviceSize, setDeviceSize] = useState<[number, number]>([0, 0])
  const [theme, setTheme] = useState<string>(themes[0])
  const [themeBtns, setThemeBtns] = useState<boolean>(false)
  const [mode, setMode] = useState<number>(0)
  const [score, setScore] = useState<number>(deviceSize[0] < mobileWidth[0] ? 6 * 8 : X * Y)
  const tetriminos: ITetrimino[] = [T, Z, S, J, L, I, O]
  const [patterns, setPatterns] = useState<[{ id: string, pattern: ITetrimino }] | []>([])
  const [matrix, setMatrix] = useState(Array.from({ length: deviceSize[0] < mobileWidth[0] ? 8 : Y }, () => Array.from({ length: deviceSize[0] < mobileWidth[0] ? 6 : X }, () => true)))

  useEffect(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    shufflePattern()
    setDeviceSize([w, h])
    console.log(`width: ${w}, height: ${h}, dev < mob: ${w < mobileWidth[0]}`);
    
    setMatrix(Array.from({ length: w < mobileWidth[0] ? 8 : Y }, () => Array.from({ length: w < mobileWidth[0] ? 6 : X }, () => true)))
  }, [])

  useEffect(() => {
    // mode変更時にpatternsをシャッフル
    shufflePattern()
  }, [mode])

  const changeMode = (mode: number) => {
    setMode(mode)
    shufflePattern()
  }

  const refleshScore = (sc: number) => {
    if (score > sc) {
      setScore(sc)
    }
  }

  const shufflePattern = () => {
    // tetriminosの中からランダムに3つ選ぶ
    // mode: 0 -> unlock, 1 -> lock
    const newPatterns = []
    for (let i = 0; i < 3; i++) {
      const index = Math.floor(Math.random() * tetriminos.length)
      const pattern = tetriminos[index]
      pattern.lock = mode === 1 ? true : false
      for (let j = 0; j < Math.floor(Math.random() * 4); j++) {
        pattern.rotate()
      }
      newPatterns.push({ id: generateUUIDv4(), pattern: pattern })
    }
    setPatterns(newPatterns)
  }

  const deepCopy = (arr) => arr.map(item => Array.isArray(item) ? deepCopy(item) : item);

  const reRollPenalty = () => {
    // ペナルティとして、matrixのtrueと隣接するfalseを1~4つtrueに変更する
    // matrixのtrueと隣接するfalseの数を数える
    const newMatrix = deepCopy(matrix)
    const penalty = Math.floor(Math.random() * 4) + 1
    let keep = []
    for (let r = 0; r < (deviceSize[0] < mobileWidth[0] ? 8 : Y); r++) {
      for (let c = 0; c <  (deviceSize[0] < mobileWidth[0] ? 6 : X); c++) {
        if (matrix[r][c] === false) {
          // 上に隣接するtrueがある場合のみ、trueに変更する
          if (r > 0 && matrix[r - 1][c] === true) {
            keep.push([r, c])
          }
          // if ((r > 0 && matrix[r - 1][c] === true) || (r < Y - 1 && matrix[r + 1][c] === true) || (c > 0 && matrix[r][c - 1] === true) || (c < X - 1 && matrix[r][c + 1] === true)) {
          //   keep.push([r, c])
          // }
        }
      }
    }
    if (keep.length > 0) {
      // keepをシャッフル
      for (let i = 0; i < penalty; i++) {
        const index = Math.floor(Math.random() * keep.length)
        const r = keep[index][0]
        const c = keep[index][1]
        newMatrix[r][c] = true
      }
    }
    setMatrix(newMatrix)
  }

  const reRoll = () => {
    shufflePattern()
    reRollPenalty()
  }

  const generatePattern = () => {
    // パターンを1つ追加する
    const index = Math.floor(Math.random() * tetriminos.length)
    const pattern = tetriminos[index]
    pattern.lock = mode === 1 ? true : false
    for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
      pattern.rotate()
    }
    return { id: generateUUIDv4(), pattern: pattern }
  }

  const removePattern = (index: string) => {
    // パターンを1つ削除する
    const newPatterns = patterns.filter((pattern) => pattern.id !== index)
    const newPattern = generatePattern()
    setPatterns([...newPatterns, newPattern])
  }
  
  const regularProps: MatrixProps = {
    width: deviceSize[0] < mobileWidth[0] ? 6 : X,
    height: deviceSize[0] < mobileWidth[0] ? 8 : Y,
    // mobileSizeとdeviceSizeを比較して、deviceSizeが小さい場合は
    patterns: patterns,
    func: removePattern,
    scoreFunc: refleshScore,
    matrix: matrix,
    setMatrix: setMatrix
  }

  return (
    <div data-theme={theme} className="grid grid-rows-[auto_1fr]">
      <div className="w-full flex max-sm:hidden flex-row-reverse flex-wrap gap-x-4 px-8 py-6">
        <motion.div transition={{ duration: 0.8 }} exit={{ opacity: themeBtns ? 0 : 1 }} className="w-fit h-fit">
          <AnimatePresence mode={"wait"} initial={false}>
            {themeBtns ? 
              <motion.button key={generateUUIDv4()} initial={{opacity: 0}} transition={{ duration: 0.82 }} animate={{opacity: 1}} exit={{ rotateZ:  180, opacity: 0 }} className="btn btn-circle btn-outline" onClick={() => setThemeBtns(!themeBtns)}>
                <AdjustmentsHorizontalIcon />
              </motion.button> :
              <motion.button key={generateUUIDv4()} initial={{opacity: 0}} transition={{ duration: 0.82 }} animate={{opacity: 1}} exit={{ rotateZ: 180, opacity: 0 }} className="btn btn-circle btn-outline" onClick={() => setThemeBtns(!themeBtns)}>
                <XMarkIcon />
              </motion.button>
            }
          </AnimatePresence>
        </motion.div>
        <motion.div className={`max-w-full overflow-hidden flex gap-x-4`} transition={{duration: 0.8}} animate={{width: themeBtns ? 0 : 'fit-content'}}>
          {
            themes.map((th, index) => (
              <button key={index} onClick={() => setTheme(th)} className={`btn ${th === theme ? 'btn-accent' : 'btn-outline'}`}>
                {th}
              </button>
            ))
          }
        </motion.div>
      </div>
      <div className="w-full h-[100dvh] pt-6 grid grid-cols-[1fr_auto_1fr] grid-rows-[auto_auto_1fr] gap-y-8 overflow-x-hidden overflow-y-scroll">
        <div className="w-fit max-sm:w-full max-sm:h-fit px-8 mx-auto text-center row-start-1 row-end-4 max-sm:row-start-1 max-sm:row-end-2 col-span-1 max-sm:col-span-3 grid max-sm:grid-cols-[auto_1fr_auto] sm:grid-rows-subgrid gap-y-8">
          <div className="row-start-1 row-end-3 col-span-1 max-sm:col-start-1 max-sm:col-end-4 grid grid-cols-subgrid sm:grid-rows-[auto_1fr] max-sm:grid-rows-subgrid">
            <button
              onClick={() => reRoll()}
              className={`btn btn-outline btn-warning text-xl mb-6 row-start-1 row-end-2 col-span-1 max-sm:col-start-1 max-sm:col-end-2`}><kbd className="kbd text-warning">R</kbd>eroll</button>
            {patterns.length > 0 && (
              <div className="flex flex-col gap-y-4 max-sm:gap-y-6 mb-6 max-sm:flex-row max-sm:row-start-2 max-sm:row-end-3 max-sm:col-start-1 max-sm:col-end-4 justify-center sm:justify-start">
                <AnimatePresence mode={"popLayout"} initial={false}>
                  {patterns.map((pt) => (
                    <motion.div key={pt.id} initial={{ opacity: 0, scale: deviceSize[0] < mobileWidth[0] ? 0.9 : 0.8, y: 50 }} transition={{ duration: 0.64, ease: "easeInOut" }} animate={{ opacity: 1, scale: deviceSize[0] < mobileWidth[0] ? 0.9 : 0.8, y: 0}} exit={{ opacity: 0, y: 70 }}>
                      <div className="flex flex-col gap-y-1 swap">
                        <PatternView key={pt.id} pattern={pt.pattern} id={pt.id} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="max-sm:row-start-1 max-sm:row-end-2 max-sm:col-start-3 max-sm:col-end-4">
            <button
              onClick={() => changeMode(mode === 1 ? 0 : 1)}
              className={`btn ${mode === 1 ? 'btn-outline' : ''} btn-warning text-xl mb-6`}><kbd className="kbd text-warning">M</kbd>ode</button>
            <div className="text-xl font-bold">{mode === 1 ? '回転を許可しない' : '回転を許可'}</div>
          </div>
        </div>
        <Matrix {...regularProps} />
        <div className="mx-auto row-start-1 row-end-2 max-sm:row-start-3 max-sm:row-end-4 col-start-3 col-end-4 max-sm:col-span-3 text-center content-center py-6 px-4 border-2 glass rounded-btn">
          <h1 className="text-xl font-bold text-warning">最小ブロック数</h1>
          <p className="text-4xl font-bold text-warning">{score}</p>
        </div>
        <div className="max-sm:mx-auto mx-12 row-start-2 row-end-3 max-sm:row-start-4 max-sm:row-end-5 col-start-3 col-end-4 max-sm:col-span-3">
          <div className="mx-auto w-full sm:w-full max-sm:mx-6 text-center text-2xl font-bold py-6 px-5 glass rounded-btn">
            これは<a href="https://vividfax.itch.io/fudge" className="text-link text-underline">Fudge</a>を参考にしたゲームです。
            <div className="font-normal">
              <h2 className="text-xl text-center font-bold">ルール</h2>
              <p className="text-left text-sm">・最小のブロック数を目指してください。</p>
              <p className="text-left text-sm">・4つのブロックをクリック(タップ)し、配置できます。</p>
              <p className="text-left text-sm">・以下の条件を全て満たすとき、選択したブロックが消えます。</p>
              <p className="text-left text-sm">1. 配置したブロックが4つ</p>
              <p className="text-left text-sm">2. 配置したブロックが連続している</p>
              <p className="text-left text-sm">3. 配置したブロックがパターンに従っている</p>
              <p className="text-left text-sm">4. (回転を許可しない)配置したブロックがパターンの向きに従っている</p>
              <p className="text-left text-sm">5. 配置したブロックの下に配置していないブロックが存在しない</p>
              <p className="text-left text-sm">・配置できるパターンがない場合、Rerollボタンを押してください。</p>
              <p className="text-left text-sm">・パターンの向きを条件に含める/含めない場合、Modeボタンを押してください。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PatternView = (props: { pattern: ITetrimino, id: string }) => {
  const pt = props.pattern;
  const id = props.id;
  const { direction, pattern, lock } = pt;
  const [localDirection, setLocalDirection] = useState<number>(direction);
  // 4x4のMinoスペースを作成し、patternの座標の位置のMinoのデザインを変える
  let minoSpace = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  // patternの座標の位置にMinoを配置する
  pattern[direction].forEach((value) => {
    const x = value[0];
    const y = value[1];
    minoSpace[y][x] = 1;
  })

  const rotate = () => {
    if (!lock) {
      pt.rotate();
      setLocalDirection(pt.direction);
    }
  }

  return (
    <span className={`transform: rotate(${localDirection * 90}deg)`} onClick={rotate}>
      {minoSpace.map((row, y) => (
        <div key={y} className="flex gap-x-1">
          {row.map((col, x) => (
            <button key={x} className={`btn btn-square sm:btn-sm max-sm:btn-xs btn-success select-none cursor-pointer ${col === 1 ? 'btn-secondary' : 'btn-link'}`}></button>
          ))}
        </div>
      ))}
    </span>
  )
};
