import { useEffect, useState, useMemo } from "react";
import { Miro } from "./Mino";
import { I } from "./Tetrimino";

export interface MatrixProps {
  width: number;
  height: number;
}

export const Matrix = (props: MatrixProps) => {
  // width x height Miro board
  const {width, height} = props;
  const [counter, setCounter] = useState(0);
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

  const [matrix, setMatrix] = useState(Array.from({length: height}, () => Array.from({length: width}, () => true)))
  const generateSortedArray = (array: number[][]) => {
    return array.sort((a, b) => {
      if (a[0] === b[0]) {
        return a[1] - b[1]
      }
      return a[0] - b[0]
    })
  }

  const judgement = () => {
    // 4つのMinoとIのpatternを比較する
    // checkedArrayの座標を、評価できる状態にする
    // checkedArrrayからxの値が最も小さい要素を取得(複数ある場合は最もyの値が小さい要素を取得)

    const sortedArray = generateSortedArray(checkedArray.filter((value) => value[0] !== -1 && value[1] !== -1))
    
    if (I.lock) {
      const pattern = generateSortedArray(I.pattern[I.direction]);
      // pattern[0]のx座標とsortedArray[0]のx座標の差分を取得し、patternの全ての要素に加算する
      // pattern[0]のy座標とsortedArray[0]のy座標の差分を取得し、patternの全ての要素に加算する
      const diffX = pattern[0][0] - sortedArray[0][0];
      const diffY = pattern[0][1] - sortedArray[0][1];
      console.log(`diffX: ${diffX}, diffY: ${diffY}`);
      
      const patternMoved = pattern.map((value) => [value[0] - diffX, value[1] - diffY]);
      console.log(`patternMoved: ${patternMoved}`);
      // patternMovedとsortedArrayを比較する
      let flag = false
      for (let i = 0; i < patternMoved.length; i++) {
        if (patternMoved[i][0] === sortedArray[i][0] && patternMoved[i][1] === sortedArray[i][1]) {
          flag = true
        } else {
          flag = false
          break
        }
      }
      return flag
    } else {
      let flag = false
      // 4つのMinoと4つのpatternを比較する
      // どれか1つでも一致した場合、trueを返す
      for (let i = 0; i < I.pattern.length; i++) {
        if (flag) {
          break
        }
        const pattern = generateSortedArray(I.pattern[i]);
        const diffX = pattern[0][0] - sortedArray[0][0];
        const diffY = pattern[0][1] - sortedArray[0][1];
        const patternMoved = pattern.map((value) => [value[0] - diffX, value[1] - diffY]);
        for (let i = 0; i < patternMoved.length; i++) {
          if (patternMoved[i][0] === sortedArray[i][0] && patternMoved[i][1] === sortedArray[i][1]) {
            flag = true
          } else {
            flag = false
            break
          }
        }
      }
      return flag
    }
  }

  return (
    <div className="matrix flex flex-col gap-y-1">
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