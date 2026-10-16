import { useGameStore } from "../stores/useGameStore";
import {
  type SettingsState,
  useSettingsStore,
} from "../stores/useSettingsStore";

import Button from "../components/ui/Button";

export default function Settings() {
  const setScene = useGameStore((state) => state.setScene);
  const music = useSettingsStore((state) => state.music);
  const sfx = useSettingsStore((state) => state.sfx);
  const mouseInput = useSettingsStore((state) => state.mouseInput);
  const setSetting = useSettingsStore((state) => state.set);

  const renderToggleSetting = (
    label: string,
    key: keyof SettingsState,
    value: boolean,
  ) => (
    <>
      <p>{label}</p>
      <Button onClick={() => setSetting((state) => ({ [key]: !state[key] }))}>
        {value ? "ON" : "OFF"}
      </Button>
    </>
  );

  return (
    <div className="flex flex-col items-center gap-16">
      <p>SETTINGS</p>
      <div className="grid grid-cols-[max-content_128px] items-center gap-x-8 gap-y-4">
        {renderToggleSetting("MUSIC", "music", music)}
        {renderToggleSetting("SFX", "sfx", sfx)}
        {renderToggleSetting("MOUSE INPUT", "mouseInput", mouseInput)}
      </div>
      <Button onClick={() => setScene("menu")}>BACK</Button>
    </div>
  );
}
