import React from "react";

const CategoryItem = ({ categories, setCategory, category }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={` ${
        category.parent_id === categories.id
          ? "bg-slate-900 text-slate-100"
          : "bg-white text-slate-900"
      } border p-2 mb-2 rounded `}
    >
      <div className={` flex items-center justify-between`}>
        <div className="">
          <span
            className={`font-bold cursor-pointer `}
            onClick={() =>
              setCategory((prev) => ({ ...prev, parent_id: categories.id }))
            }
          >
            {categories.name}
          </span>
          {categories.children.length > 0 && (
            <span
              className="ml-2 text-sm text-gray-500 cursor-pointer"
              onClick={handleToggle}
            >
              [{isOpen ? "-" : "+"}]
            </span>
          )}
        </div>
        {/* Add any additional category information as needed */}
      </div>
      {isOpen && (
        <div className="ml-4 mt-2">
          {categories.children.map((child, key) => (
            <CategoryItem
              key={key}
              categories={child}
              category={category}
              setCategory={setCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default CategoryItem;
