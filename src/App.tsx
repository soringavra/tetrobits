import Layout from "./components/Layout";
import SceneRouter from "./components/SceneRouter";
import Modal from "./components/ui/Modal";
import DebugPanel from "./components/DebugPanel";

export default function App() {
  return (
    <Layout>
      <SceneRouter />
      <Modal />
      <DebugPanel />
    </Layout>
  );
}
