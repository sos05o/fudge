import { useEffect, useState } from 'react'
import './app.css'
import { Matrix, MatrixProps } from './components/Matrix'
import { ITetrimino, T, Z, S, J, L, I, O } from './components/Tetrimino'
import { v4 as uuidv4 } from 'uuid'
import { AnimatePresence, motion } from 'framer-motion'

const generateUUIDv4 = (): string => {
  return uuidv4()
}

const X = 10
const Y = 14

export const App = () => {
  const [mode, setMode] = useState<number>(0)
  const [score, setScore] = useState<number>(X * Y)
  const tetriminos: ITetrimino[] = [T, Z, S, J, L, I, O]
  const [patterns, setPatterns] = useState<[{ id: string, pattern: ITetrimino }] | []>([])
  const [matrix, setMatrix] = useState(Array.from({length: Y}, () => Array.from({length: X}, () => true)))

  useEffect(() => {
    shufflePattern()
  }, [])

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
    for (let r = 0; r < Y; r++) {
      for (let c = 0; c < X; c++) {
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
    width: X,
    height: Y,
    patterns: patterns,
    func: removePattern,
    scoreFunc: refleshScore,
    matrix: matrix,
    setMatrix: setMatrix
  }

  return (
    <div className="mt-8 grid grid-cols-[1fr_auto_1fr] grid-rows-[repeat(3,auto)] gap-y-8 overflow-x-hidden overflow-y-scroll">
      <div className="w-fit max-sm:w-full max-sm:h-fit px-8 mx-auto text-center row-start-1 row-end-4 max-sm:row-start-1 max-sm:row-end-2 col-span-1 max-sm:col-span-3 grid max-sm:grid-cols-[auto_1fr_auto] sm:grid-rows-subgrid gap-y-8">
        <button
          onClick={() => reRoll()}
          className={`btn btn-outline btn-warning text-xl mb-6 row-start-1 row-end-2 col-span-1 max-sm:col-start-1 max-sm:col-end-2`}><kbd className="kbd text-warning">R</kbd>eroll</button>
        {patterns.length > 0 && (
          <div className="flex flex-col gap-y-4 max-sm:gap-y-6 mb-6 max-sm:flex-row max-sm:row-start-2 max-sm:row-end-3 max-sm:col-start-1 max-sm:col-end-4 justify-center">
            <AnimatePresence mode={"popLayout"} initial={false}>
              {patterns.map((pt, index) => (
                <motion.div key={pt.id} initial={{opacity: 0, rotate: 0}} transition={{duration: 0.64, ease: "easeInOut"}} animate={{opacity: 1}} exit={{opacity: 0, y: -50}}>
                  <div className="flex flex-col gap-y-1 swap">
                    <PatternView key={pt.id} pattern={pt.pattern} id={pt.id} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="max-sm:row-start-1 max-sm:row-end-2 max-sm:col-start-3 max-sm:col-end-4">
          <button
            onClick={() => changeMode(mode === 1 ? 0 : 1)}
            className={`btn ${mode === 1 ? 'btn-outline' : ''} btn-warning text-xl mb-6`}><kbd className="kbd text-warning">M</kbd>ode</button>
          <div className="text-xl font-bold">{mode === 1 ? '回転を許可しない' : '回転を許可'}</div>
        </div>
      </div>
      <Matrix {...regularProps} />
      <div className="mx-auto row-start-1 row-end-2 max-sm:row-start-3 max-sm:row-end-4 col-start-3 col-end-4 max-sm:col-span-3 text-center py-6 px-4 border-2 glass rounded-btn">
        <h1 className="text-xl font-bold text-warning">最小ブロック数</h1>
        <p className="text-4xl font-bold text-warning">{score}</p>
      </div>
    </div>
  )
}

const PatternView = (props: { pattern: ITetrimino, id: string }) => {
  const pt = props.pattern;
  const id = props.id;
  const { direction, pattern, lock } = pt;
  // 4x4のMinoスペースを作成し、patternの座標の位置のMinoのデザインを変える
  let minoSpace = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  // patternの座標の位置にMinoを配置する
  pattern[direction].forEach((value) => {
    const x = value[0];
    const y = value[1];
    minoSpace[y][x] = 1;
  })

  return (
    <>
      {minoSpace.map((row, y) => (
        <div key={y} className="flex gap-x-1">
          {row.map((col, x) => (
            <button key={x} className={`btn btn-square sm:btn-sm max-sm:btn-xs btn-glass select-none cursor-pointer ${col === 1 ? 'btn-secondary' : 'btn-link'}`}></button>
          ))}
        </div>
      ))}
    </>
  )
};
