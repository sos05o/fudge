import './app.css'
import { Matrix, MatrixProps } from './components/Matrix'

export const App = () => {
  const regularProps: MatrixProps = {
    width: 10,
    height: 20
  }
  return (
    <>
      <Matrix {...regularProps} />
    </>
  )
}