import SceneManager from "./components/SceneManager";
import Modal from "./components/Modal";

export default function App() {
  return (
    <div className="grid min-h-dvh place-items-center p-4">
      <SceneManager />
      <Modal />
    </div>
  );
}
