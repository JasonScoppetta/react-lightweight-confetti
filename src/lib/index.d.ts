import { FC } from "react";

export type ConfettiColor = [number, number];

export interface Confetti {
  start?: boolean;
  count?: number;
  gravity?: number;
  endVelocity?: number;
  drag?: number;
  confettiMaxWidth?: number;
  confettiMaxHeight?: number;
  confettiMinWidth?: number;
  confettiMinHeight?: number;
  explosionYForce?: number;
  explosionXForce?: number;
  colors?: ConfettiColor[] | null;
  randomColors?: number;
}

declare const Confetti: FC<Confetti>;
export default Confetti;
