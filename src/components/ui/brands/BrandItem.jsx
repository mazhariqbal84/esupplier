import React from "react";

const BrandItem = ({ brands, setBrand, brand }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={` ${
        brand.parent_id === brands.id
          ? "bg-slate-900 text-slate-100"
          : "bg-white text-slate-900"
      } border p-2 mb-2 rounded `}
    >
      <div className={` flex items-center justify-between`}>
        <div className="">
          <span
            className={`font-bold cursor-pointer `}
            onClick={() =>
              setBrand((prev) => ({ ...prev, parent_id: brands.id }))
            }
          >
            {brands.name}
          </span>
          {brands.children.length > 0 && (
            <span
              className="ml-2 text-sm text-gray-500 cursor-pointer"
              onClick={handleToggle}
            >
              [{isOpen ? "-" : "+"}]
            </span>
          )}
        </div>
        {/* Add any additional brand information as needed */}
      </div>
      {isOpen && (
        <div className="ml-4 mt-2">
          {brands.children.map((child, key) => (
            <BrandItem
              key={key}
              brands={child}
              brand={brand}
              setBrand={setBrand}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default BrandItem;
