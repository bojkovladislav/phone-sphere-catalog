roimport { FC, useMemo, useState, useRef, TouchEvent, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { renderArrow } from "../../helpers/renderArrow";
import "./productsSlider.scss";

interface Props {
  title: string;
  itemsLength: number;
}

export const ProductsSlider: FC<Props> = ({ children, title, itemsLength }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const theme = useAppSelector((state) => state.theme.value);
  const newItemsLength = useMemo(() => itemsLength - 4, [itemsLength]);
  const isFreeRightSpace = useMemo(
    () => activeIndex === newItemsLength - 1,
    [activeIndex, newItemsLength]
  );
  const isFreeLeftSpace = useMemo(() => activeIndex === 0, [activeIndex]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const updateIndex = (newIndex: number) => {
    let updatedIndex = newIndex;

    if (updatedIndex < 0) {
      updatedIndex = 0;
    } else if (updatedIndex >= newItemsLength) {
      updatedIndex = newItemsLength - 1;
    }

    setActiveIndex(updatedIndex);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchDelta = touchEndX - touchStartX;

    if (touchDelta > 50) {
      updateIndex(activeIndex - 1);
    } else if (touchDelta < -50) {
      updateIndex(activeIndex + 1);
    }
  };

  const handleArrowCLick = (direction: "left" | "right") => {
    if (direction === "right") {
      updateIndex(activeIndex + 1);
    } else {
      updateIndex(activeIndex - 1);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      setItemWidth(sliderRef.current.offsetWidth / 4); // Adjust as needed
    }
  }, [sliderRef.current]);

  return (
    <div className="products-slider" ref={sliderRef}>
      <div className="products-slider__container">
        <h1 className={`title title--${theme}`}>{title}</h1>

        <div className="products-slider__buttons">
          <button
            type="button"
            onClick={() => handleArrowCLick("left")}
            className={`products-slider__button products-slider__button--${theme} ${
              isFreeLeftSpace ? "disabled" : ""
            }`}
            disabled={isFreeLeftSpace}
          >
            {renderArrow("left", theme)}
          </button>

          <button
            type="button"
            onClick={() => handleArrowCLick("right")}
            className={`products-slider__button products-slider__button--${theme} ${
              isFreeRightSpace ? "disabled" : ""
            }`}
            disabled={isFreeRightSpace}
          >
            {renderArrow("right", theme)}
          </button>
        </div>
      </div>

      <div
        className="products-slider__inner"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${-activeIndex * itemWidth}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
