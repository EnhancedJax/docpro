import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

const useKeyboard = (waitUntilShown = false) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const verb = useMemo(
    () => (waitUntilShown ? "Did" : "Will"),
    [waitUntilShown]
  );

  useEffect(() => {
    const keyboardOpenListener = Keyboard.addListener(
      `keyboard${verb}Show`,
      (e) => {
        setIsKeyboardOpen(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardCloseListener = Keyboard.addListener(
      `keyboard${verb}Hide`,
      () => {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      if (keyboardOpenListener) keyboardOpenListener.remove();
      if (keyboardCloseListener) keyboardCloseListener.remove();
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};

export default useKeyboard;
