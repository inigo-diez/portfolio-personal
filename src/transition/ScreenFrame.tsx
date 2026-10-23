/** Outline of the screen while it grows into the canvas or a page (only visible during the transition). */
export function ScreenFrame() {
  return (
    <div className="screen-frame" data-screen-frame aria-hidden="true">
      <i data-edge="t" />
      <i data-edge="r" />
      <i data-edge="b" />
      <i data-edge="l" />
    </div>
  );
}
