import React from "react";

const Input = ({ onChange, value, type, className, placeholder }) => {
  return (
    <input
      className={className}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
