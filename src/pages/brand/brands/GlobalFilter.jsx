import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
const GlobalFilter = ({ filter, setGlobalFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = (e) => {
    setValue(e.target.value);
    setGlobalFilter(e.target.value || "");
  };
  return (
    <div>
      <Textinput
        defaultValue={filter}
        autoComplete="off"
        inputName="search"
        type="search"
        onChange={onChange}
        placeholder="search..."
        id="global-search"
      />
    </div>
  );
};

export default GlobalFilter;
