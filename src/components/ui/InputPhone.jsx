import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";

const InputPhone = ({
  phone,
  setPhone,
  error,
  horizontal,
  validate,
  classLabel = "form-label",
  label,
  id,
  name,
  countryCallingCodeEditable = false,
  defaultCountry = "AE",
  className,
  msgTooltip,
  description,
  register,
  onChange,
  control,
  defaultValue,
  ...rest
}) => {
  return (
    <div
      className={`fromGroup  ${error ? "has-error" : ""}  ${
        horizontal ? "flex" : ""
      }  ${validate ? "is-valid" : ""} `}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel}  ${
            horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
          }`}
        >
          {label}
        </label>
      )}
      {control ? (
        <div className={`relative ${horizontal ? "flex-1" : ""}`}>
          <PhoneInputWithCountry
            international
            name="phoneInputWithCountrySelect"
            control={control}
            {...rest}
            className={`${
              error ? " has-error" : " "
            } form-control flex py-2 ${className} `}
            defaultCountry={defaultCountry}
            defaultValue={defaultValue}
            countryCallingCodeEditable={countryCallingCodeEditable}
            rules={{
              required: true,
              // validate: (value) => isValidPhoneNumber(value),
            }}
          />
        </div>
      ) : (
        <div className={`relative ${horizontal ? "flex-1" : ""}`}>
          <PhoneInput
            international
            value={phone}
            onChange={onChange}
            className={`${
              error ? " has-error" : " "
            } form-control flex py-2 ${className} `}
            defaultCountry={defaultCountry}
            defaultValue={defaultValue}
            // CountryIcon
            countryCallingCodeEditable={countryCallingCodeEditable}
            rules={{
              required: true,
              // validate: (value) => isValidPhoneNumber(value),
            }}
          />
        </div>
      )}
      {/* error and success message*/}
      {error && (
        <div
          className={` mt-2 ${
            msgTooltip
              ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
              : " text-danger-500 block text-sm"
          }`}
        >
          {error[0] && error}
          {error?.message && error?.message}
        </div>
      )}
      {/* validated and success message*/}
      {validate && (
        <div
          className={` mt-2 ${
            msgTooltip
              ? " inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded"
              : " text-success-500 block text-sm"
          }`}
        >
          {validate}
        </div>
      )}
      {/* only description */}
      {description && <span className="input-description">{description}</span>}
    </div>
  );
};

export default InputPhone;
