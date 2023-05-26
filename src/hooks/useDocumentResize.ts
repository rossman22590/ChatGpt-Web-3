import { useState, useEffect } from 'react';

function useDocumentResize(target: HTMLElement = document.body) {
  const [rect, setRect] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const handleResize = () => {
      if (target) {
        setRect({
          width: target.offsetWidth,
          height: target.offsetHeight
        });
      }
    };

    // Add a Resize event monitor
    window.addEventListener('resize', handleResize);

    // Get the initial width
    if (target) {
      setRect({
        width: target.offsetWidth,
        height: target.offsetHeight
      });
    }

    // Remove the monitor when the component is uninstalled
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [target]);

  return rect;
}

export default useDocumentResize;
