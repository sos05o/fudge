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
      className={`btn sm:btn-sm max-sm:btn-xs btn-square btn-glass rounded-2 select-none cursor-pointer ${status ? checked ? 'btn-secondary' : 'btn-active btn-ghost' : 'btn-link'}`}>
    </button>
  )
}
