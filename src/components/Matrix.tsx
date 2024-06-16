import React, { useEffect, useState } from "react";
import { Miro } from "./Mino";
import { ITetrimino } from "./Tetrimino";

export interface MatrixProps {
  width: number;
  height: number;
  patterns: [{id: string, pattern: ITetrimino}] | [];
  func: (index: string) => void;
  scoreFunc: (sc: number) => void;
  matrix: boolean[][];
  setMatrix: React.Dispatch<React.SetStateAction<boolean[][]>>;
}

export const Matrix = (props: MatrixProps) => {
  // width x height Miro board
  const {width, height, patterns, func, scoreFunc, matrix, setMatrix} = props;
  
  const [counter, setCounter] = useState(0);
  const [score, setScore] = useState(width * height);
  // 4つのMinoの座標を保持する
  const [checkedArray, setCheckedArray] = useState<number[][]>(Array.from({length: 4}, () => [-1, -1]));

  useEffect(() => {
    if (counter === 4) {
      if (judgement()) {
        console.log('match');
      } else {
        console.log('not match');
      }
    }
  }, [counter])

  const checkedArrayChecker = (x: number, y: number): boolean => {
    for (let i = 0; i < checkedArray.length; i++) {
      if (checkedArray[i][0] === x && checkedArray[i][1] === y) {
        return true
      }
    }
    return false
  }

  const handleCounter = (x: number, y: number, checked: boolean): boolean => {
    // 返り値
    // true -> 更新必要あり, false -> 更新不要
    if (matrix[y][x] === false) {
      // 判定対象外      
      return false
    }
    if (checked === true) {
      // チェック済み
      setCounter(counter - 1);
      // 4つのMinoの座標を更新する
      setCheckedArray(checkedArray.map((value) => {
        if (value[0] === x && value[1] === y) {
          return [-1, -1]
        }
        return value
      }))
      return true
    }
    if (counter + 1 <= 4) {
      // チェック可能
      setCounter(counter + 1);
      // 4つのMinoの座標を更新する
      // 一致する要素がない場合、1度だけ更新する
      let flag = false
      setCheckedArray(checkedArray.map((value) => {
        if (value[0] === -1 && value[1] === -1 && flag === false) {
          flag = true
          return [x, y]
        }
        return value
      }))
      return true
    }
    return false
  }

  // const [matrix, setMatrix] = useState(Array.from({length: height}, () => Array.from({length: width}, () => true)))
  const generateSortedArray = (array: number[][]) => {
    return array.sort((a, b) => {
      if (a[0] === b[0]) {
        return a[1] - b[1]
      }
      return a[0] - b[0]
    })
  }

  // パターンマッチ
  const patternMatching = (pattern: ITetrimino, sortedArray: number[][], flag: boolean, direction: number): boolean => {
    if (flag) return flag
    const pt = generateSortedArray(pattern.pattern[direction]);
    const diffX = pt[0][0] - sortedArray[0][0];
    const diffY = pt[0][1] - sortedArray[0][1];
    const patternMoved = pt.map((value) => [value[0] - diffX, value[1] - diffY]);
    for (let i = 0; i < patternMoved.length; i++) {
      if (patternMoved[i][0] === sortedArray[i][0] && patternMoved[i][1] === sortedArray[i][1]) {
        flag = true
      } else {
        flag = false
        break
      }
    }
    return flag
  }

  // 比較関数
  const isTargetInSortedArray = (sortedArray: number[][], target: [number, number]): boolean => {
    return sortedArray.some(([x, y]) => x === target[0] && y === target[1]);
  };

  // 審議
  const judgement = () => {
    // 4つのMinoとIのpatternを比較する
    // checkedArrayの座標を、評価できる状態にする
    // checkedArrrayからxの値が最も小さい要素を取得(複数ある場合は最もyの値が小さい要素を取得)    
    const sortedArray = generateSortedArray(checkedArray.filter((value) => value[0] !== -1 && value[1] !== -1))

    let flag = false
    let id = ""
    patterns.forEach(pattern => {
      if (flag) {
        return
      }
      if (pattern.pattern.lock) {
        // lockがtrueの場合
        flag = patternMatching(pattern.pattern, sortedArray, flag, pattern.pattern.direction)
        if (flag) id = pattern.id
      } else {
        // lockがfalseの場合
        for (let i = 0; i < pattern.pattern.pattern.length; i++) {
          flag = patternMatching(pattern.pattern, sortedArray, flag, i)
          if (flag) {
            id = pattern.id
            break
          }
        }
      }
    })

    // Pattern Matchingが成功した場合
    // 対象のMinoのy座標について、上の座標にMinoが存在しないことを確認する
    // 存在する場合、Pattern Matchingが失敗したとみなす
    // ただし、対象のMinoがMinoの上座標に存在する場合は無視する

    const deepCopy = (arr) => arr.map(item => Array.isArray(item) ? deepCopy(item) : item);

    if (flag) {
      let reMatrix = deepCopy(matrix)
      sortedArray.forEach(value => {
        reMatrix[value[1]][value[0]] = false
      })

      let keep = []
      for (let i = 0; i < sortedArray.length; i++) {
        // sortedArray[i][0]とreMatrix[n][sortedArray[i][0]]が一致した場合、[n, sortedArray[i][0]]をkeepに追加
        for (let n = 1; n < height - sortedArray[i][1]; n++) {
          
          if (reMatrix[n + sortedArray[i][1]][sortedArray[i][0]]) {
            // sortedArrayに存在しない座標の組のみkeepに追加
            
            const result = isTargetInSortedArray(sortedArray, [sortedArray[i][0], sortedArray[i][1] + n]);
            if (!result) {
              keep.push([n + sortedArray[i][1], sortedArray[i][0]])
            }
          }
        }
      }

      // sortedArrayのx座標とy座標を見て、x座標が同じでy座標が大きい要素を取得
      // その要素が存在する場合、Pattern Matchingが失敗したとみなす
      
      // reMatrixから、sortedArrayのx座標が同じ要素かつy座標が大きい要素を取得
      // その要素にtrueが存在する場合、Pattern Matchingが失敗したとみなす

      // sortedArray.forEach(point => {
      //   const targetArray = reMatrix.filter()
      // })
      // // sortedArrayのy座標がyより大きく、x座標がxの要素を取得
      // const targetArray = sortedArray.filter(value => value[0] === x && value[1] > y)
      // // targetArrayの要素にtrueが存在するか確認
      // let flag = true
      // targetArray.forEach(value => {
      //   if (reMatrix[value[1]][value[0]]) {
      //     flag = false
      //   }
      // })
      
      // sortedArray.forEach(point => {
      //   reMatrix.filter((row, i) => i > point[1]).forEach((row, i) => {
      //   })
      // })
      if (flag && keep.length <= 0) {
        func(id)
        setMatrix(reMatrix)
        setCounter(0)
        setCheckedArray(Array.from({length: 4}, () => [-1, -1]))
        // 最小スコアの更新
        // 最小スコアは、matrixのtrueの数
        let sc = 0
        reMatrix.forEach(row => {
          sc += row.filter(value => value).length
        })
        scoreFunc(sc)
      }
    }
    return flag
  }

  return (
    <div className="matrix w-fit mx-auto flex flex-col gap-y-1 row-start-1 row-end-3 col-span-1 max-sm:row-start-2 max-sm:row-end-3 max-sm:col-span-3">
      {matrix.map((row, i) => (
        <div key={i} className="flex gap-x-1">
          {row.map((flag, j) => (
            <div key={j} className="flex">
              <Miro x={j} y={i} status={flag} checked={checkedArrayChecker(j, i)} func={handleCounter} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}