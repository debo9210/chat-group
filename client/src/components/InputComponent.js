import React from 'react';

const InputComponent = ({
  inputType,
  inputName,
  iconType,
  placeholder,
  inputHandler,
  errorMsg,
  name,
}) => {
  return (
    <div className='InputGroupContainer'>
      <small className='InputName'>{inputName}</small>
      <div
        className='InputGroup'
        style={
          !errorMsg ? { margin: '3px 0 15px 0' } : { margin: '3px 0 0px 0' }
        }
      >
        <i className='material-icons'>{iconType}</i>
        <input
          className='InputDisplay'
          type={inputType}
          placeholder={placeholder}
          onChange={inputHandler}
          name={name}
          autoComplete='on'
        />
      </div>
      <small
        className='ErrorMsg'
        style={
          errorMsg ? { display: 'inline-block', marginBottom: '10px' } : null
        }
      >
        {errorMsg ? errorMsg : null}
      </small>
    </div>
  );
};

export default InputComponent;
