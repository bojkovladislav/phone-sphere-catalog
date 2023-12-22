import { FC, useRef } from "react";
import Slider from "react-slick";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { renderArrow } from "../../helpers/renderArrow";
import "./productsSlider.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Product } from "../../types/product";
import { ProductItem } from "../ProductItem/ProductItem";
import { addProducts } from "@/helpers/addProducts";

interface ProductsSliderProps {
  title: string;
  products: Product[];
}

export const ProductsSlider: FC<ProductsSliderProps> = ({
  title,
  products,
}) => {
  const theme = useAppSelector((state) => state.theme.value);
  const sliderRef = useRef<Slider | null>(null);
  const favoriteProducts = useAppSelector(
    (state) => state.favoriteProducts.value
  );
  const shoppingCart = useAppSelector((state) => state.shoppingCart.value);
  const dispatch = useAppDispatch();

  const handleAddProductToCart = (product: Product) => {
    addProducts(dispatch, shoppingCart, product, "shoppingCart");
  };

  const handleAddProductToFavorites = (product: Product) => {
    addProducts(dispatch, favoriteProducts, product, "favoriteProducts");
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1049,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 819,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleArrowClick = (direction: "left" | "right") => {
    const slider = sliderRef.current;

    if (slider) {
      direction === "left" ? slider.slickPrev() : slider.slickNext();
    }
  };

  return (
    <div className="products-slider">
      <div className="products-slider__container">
        <h1 className={`title title--${theme}`}>{title}</h1>

        <div className="products-slider__buttons">
          <button
            type="button"
            onClick={() => handleArrowClick("left")}
            className={`products-slider__button products-slider__button--${theme}`}
          >
            {renderArrow("left", theme)}
          </button>

          <button
            type="button"
            onClick={() => handleArrowClick("right")}
            className={`products-slider__button products-slider__button--${theme}`}
          >
            {renderArrow("right", theme)}
          </button>
        </div>
      </div>
      <Slider ref={(slider) => (sliderRef.current = slider)} {...settings}>
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            addToCart={handleAddProductToCart}
            addToFavorites={handleAddProductToFavorites}
          />
        ))}
      </Slider>
    </div>
  );
};
