import React from "react";

const ProductItem = ({ products, setProduct, product }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={` ${
        product.parent_id === products.id
          ? "bg-slate-900 text-slate-100"
          : "bg-white text-slate-900"
      } border p-2 mb-2 rounded `}
    >
      <div className={` flex items-center justify-between`}>
        <div className="">
          <span
            className={`font-bold cursor-pointer `}
            onClick={() =>
              setProduct((prev) => ({ ...prev, parent_id: products.id }))
            }
          >
            {products.name}
          </span>
          {products.children.length > 0 && (
            <span
              className="ml-2 text-sm text-gray-500 cursor-pointer"
              onClick={handleToggle}
            >
              [{isOpen ? "-" : "+"}]
            </span>
          )}
        </div>
        {/* Add any additional product information as needed */}
      </div>
      {isOpen && (
        <div className="ml-4 mt-2">
          {products.children.map((child, key) => (
            <ProductItem
              key={key}
              products={child}
              product={product}
              setProduct={setProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ProductItem;
