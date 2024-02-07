import React, { useReducer, useEffect } from 'react';

import { validate } from '../util/validators';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      };
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        className={`${props.elementClasses} text-black rounded-3xl px-3 py-1 min-w-[300px]`}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        className={`${props.elementClasses} text-black rounded-3xl px-3 py-1 min-w-[300px]`}
      />
    );

  return (
    <div
      className={` ${!inputState.isValid &&
        inputState.isTouched &&
        props.wrapperClasses} flex flex-col`}
    >
      {/* Heading */}
      <label className={`${props.labelClasses} w-full`} htmlFor={props.id}>{props.label}</label>

      {/* Input Element */}
      {element}

      {/* Error message */}
      {!inputState.isValid && inputState.isTouched && 
        <p className={`${props.errorClasses} text-red-500`}>
          {props.errorText}
        </p>
      }
    </div>
  );
};

export default Input;
