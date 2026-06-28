export default function TooSmall() {
  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-black p-4">
      <div className="flex flex-col gap-8 text-center">
        <p>UH OH!</p>
        <p>YOUR SCREEN ISN'T WIDE ENOUGH TO RENDER THE GAME PROPERLY.</p>
        <p>
          PLEASE EXPAND YOUR BROWSER WINDOW OR SWITCH TO A DEVICE WITH A LARGER
          SCREEN TO KEEP PLAYING.
        </p>
      </div>
    </div>
  );
}
