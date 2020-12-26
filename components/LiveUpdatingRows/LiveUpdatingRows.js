/**
 * From: https://itnext.io/animating-list-reordering-with-react-hooks-aca5e7eeafba
 */

import React, { useEffect, useLayoutEffect, useState } from "react";

import { usePrevious } from "../../hooks/usePrevious";

export const LiveUpdatingRows = ({ children }) => {
  const prevChildren = usePrevious(children);
  const [boundingBox, setBoundingBox] = useState({});
  const [prevBoundingBox, setPrevBoundingBox] = useState({});

  const calculateBoundingBoxes = (children) => {
    const boundingBoxes = {};
    React.Children.forEach(children, (child) => {
      const domNode = child.ref.current;
      const nodeBoundingBox = domNode.getBoundingClientRect();
      boundingBoxes[child.key] = nodeBoundingBox;
    });
    return boundingBoxes;
  };

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(children);
    setBoundingBox(newBoundingBox);
  }, [children]);

  useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes(prevChildren);
    setPrevBoundingBox(prevBoundingBox);
  }, [prevChildren]);

  useEffect(() => {
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;
    if (hasPrevBoundingBox) {
      React.Children.forEach(children, (child) => {
        const domNode = child.ref.current;
        const firstBox = prevBoundingBox[child.key];
        if (firstBox) {
          const lastBox = boundingBox[child.key];
          const changeInY = firstBox.top - lastBox.top;  
          if (changeInY) {
            requestAnimationFrame(() => {
              // Before the DOM paints, invert child to old position
              domNode.style.transform = `translateY(${changeInY}px)`;
              domNode.style.transition = "transform 0s";
              requestAnimationFrame(() => {
                // After the previous frame, remove
                // the transistion to play the animation
                domNode.style.transform = "";
                domNode.style.transition = "transform 500ms";
              });
            });
          }
        }
      });
    }
  }, [boundingBox, prevBoundingBox, children]);

  return children;
};
