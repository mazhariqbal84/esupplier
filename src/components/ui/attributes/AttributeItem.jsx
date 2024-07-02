import React from "react";

const AttributeItem = ({ attributes, setAttribute, attribute }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={` ${
        attribute.parent_id === attributes.id
          ? "bg-slate-900 text-slate-100"
          : "bg-white text-slate-900"
      } border p-2 mb-2 rounded `}
    >
      <div className={` flex items-center justify-between`}>
        <div className="">
          <span
            className={`font-bold cursor-pointer `}
            onClick={() =>
              setAttribute((prev) => ({ ...prev, parent_id: attributes.id }))
            }
          >
            {attributes.name}
          </span>
          {attributes.children.length > 0 && (
            <span
              className="ml-2 text-sm text-gray-500 cursor-pointer"
              onClick={handleToggle}
            >
              [{isOpen ? "-" : "+"}]
            </span>
          )}
        </div>
        {/* Add any additional attribute information as needed */}
      </div>
      {isOpen && (
        <div className="ml-4 mt-2">
          {attributes.children.map((child, key) => (
            <AttributeItem
              key={key}
              attributes={child}
              attribute={attribute}
              setAttribute={setAttribute}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default AttributeItem;
