import React from 'react';

const InputComponent = ({ inputType, inputName, iconType, placeholder }) => {
  return (
    <div className='InputGroupContainer'>
      <small>{inputName}</small>
      <div className='InputGroup'>
        <i className='material-icons'>{iconType}</i>
        <input type={inputType} placeholder={placeholder} />
      </div>
    </div>
  );
};

export default InputComponent;
