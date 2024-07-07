import React from 'react';

function FormField({ labelName, placeholder, inputType, isTextArea, value, handleChange, disabled, options }) {
  return (
    <label className='flex-1 w-full flex flex-col'>
      {labelName && (
        <span className='font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]'>
          {labelName}
        </span>
      )}
      {inputType === 'select' ? (
        <select
          required
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent
            text-[#808191] dark:bg-[#1c1c24] text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          disabled={disabled}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43]
            bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] ${disabled ? 'cursor-not-allowed' : ''}`}
        />
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step='0.1'
          placeholder={placeholder}
          disabled={disabled}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43]
          bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] ${disabled ? 'cursor-not-allowed' : ''}`}
        />
      )}
    </label>
  );
}

export default FormField;
