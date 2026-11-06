import { cn } from "@/lib/utils";

type WaveDividerProps = {
  /** CSS colour of the wave (default: the tinted band colour). */
  color?: string;
  /** Mirror vertically (wave hangs from the top instead of rising from the bottom). */
  flip?: boolean;
  className?: string;
};

/** Wave-edged strip to place between two bands (the `.sec.tint` / `.ctab` edges already include their own waves). */
export function WaveDivider({ color, flip, className }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("wave-div", flip && "flip", className)}
      style={color ? ({ "--wd-fill": color } as React.CSSProperties) : undefined}
    />
  );
}
