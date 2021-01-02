/**
 * From: https://itnext.io/animating-list-reordering-with-react-hooks-aca5e7eeafba
 */

import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

import { usePrevious } from '@/hooks/usePrevious'

interface BoundingBoxes {
  [id: string]: DOMRect
}

export const LiveUpdatingRows: FunctionComponent = ({ children }) => {
  const prevChildren = usePrevious(children)
  const [boundingBox, setBoundingBox] = useState<BoundingBoxes>({})
  const [prevBoundingBox, setPrevBoundingBox] = useState<BoundingBoxes>({})

  const calculateBoundingBoxes = (children: React.ReactNode) => {
    const boundingBoxes: BoundingBoxes = {}
    React.Children.forEach(children, (child) => {
      const childWithRef = child as React.ComponentPropsWithRef<'div'>
      const ref = childWithRef?.ref as React.RefObject<HTMLDivElement>
      const domNode = ref.current
      const key = (child as React.ReactElement).key
      if (domNode && key !== null) {
        const nodeBoundingBox = domNode.getBoundingClientRect()
        boundingBoxes[`${key}`] = nodeBoundingBox
      }
    })
    return boundingBoxes
  }

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(children)
    setBoundingBox(newBoundingBox)
  }, [children])

  useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes(prevChildren)
    setPrevBoundingBox(prevBoundingBox)
  }, [prevChildren])

  useEffect(() => {
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length
    if (hasPrevBoundingBox) {
      React.Children.forEach(children, (child) => {
        const childWithRef = child as React.ComponentPropsWithRef<'div'>
        const ref = childWithRef?.ref as React.RefObject<HTMLDivElement>
        const domNode = ref.current
        const key = (child as React.ReactElement).key
        if (key) {
          const firstBox = prevBoundingBox[`${key}`]
          if (firstBox && domNode) {
            const lastBox = boundingBox[`${key}`]
            const changeInY = firstBox.top - lastBox.top
            if (changeInY) {
              requestAnimationFrame(() => {
                // Before the DOM paints, invert child to old position
                domNode.style.transform = `translateY(${changeInY}px)`
                domNode.style.transition = 'transform 0s'
                requestAnimationFrame(() => {
                  // After the previous frame, remove
                  // the transistion to play the animation
                  domNode.style.transform = ''
                  domNode.style.transition = 'transform 500ms'
                })
              })
            }
          }
        }
      })
    }
  }, [boundingBox, prevBoundingBox, children])

  return <div>{children}</div>
}
