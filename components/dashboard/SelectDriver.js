import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { initDriver } from '../../reducers/driverReducer';
import { borderInputHandler } from '../../lib/handler';

const selectStyles = {
  control: (styles) => ({ ...styles, borderRadius: 'none', border: 'none' }),
};

const SelectDriver = React.forwardRef(({ onChange = null, ...rest }, ref) => {
  const dispatch = useDispatch();
  const driver = useSelector((s) => s.driver);
  const pengguna = useSelector((s) => s.pengguna);
  const [selectedDriver, setSelectedDriver] = useState('');
  const options = () => {
    if (!driver) return [];
    return driver.map((m) => ({ label: m.nama, value: m.id, obj: m }));
  };

  const onChangeHandler = (value) => {
    setSelectedDriver(value.obj);
    onChange && onChange(value.obj);
  };
  useEffect(() => {
    dispatch(initDriver(pengguna?.token));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {driver && (
        <Select
          styles={selectStyles}
          className={`border ${borderInputHandler(selectedDriver)}`}
          options={options()}
          onChange={onChangeHandler}
          {...rest}
        />
      )}
    </>
  );
});
SelectDriver.displayName = 'Select Driver';
export default SelectDriver;
