import { useState } from "react";

export interface MiroProps {
  x: number;
  y: number;
  status: boolean;
  checked: boolean;
  func: (x: number, y: number, checked: boolean) => boolean;
}

export const Miro = (props: MiroProps) => {
  const {x, y, status, checked, func} = props;

  const handleClick = () => {
    const flag = func(x, y, checked);
  }

  return (
    <button
      onClick={status ? handleClick : _ => {}}
      className={`btn sm:btn-sm max-sm:btn-md btn-square btn-glass select-none cursor-pointer ${status ? checked ?  'btn-success' : 'btn-secondary' : 'btn-link'}`}>
    </button>
  )
}
