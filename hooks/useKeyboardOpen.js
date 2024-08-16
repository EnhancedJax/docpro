import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

const useKeyboardOpen = (waitUntilShown = false) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const verb = useMemo(
    () => (waitUntilShown ? "Did" : "Will"),
    [waitUntilShown]
  );

  useEffect(() => {
    const keyboardOpenListener = Keyboard.addListener(
      `keyboard${verb}Show`,
      () => setIsKeyboardOpen(true)
    );
    const keyboardCloseListener = Keyboard.addListener(
      `keyboard${verb}Hide`,
      () => setIsKeyboardOpen(false)
    );

    return () => {
      if (keyboardOpenListener) keyboardOpenListener.remove();
      if (keyboardCloseListener) keyboardCloseListener.remove();
    };
  }, []);

  return isKeyboardOpen;
};

export default useKeyboardOpen;
