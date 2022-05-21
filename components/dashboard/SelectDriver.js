import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { initDriver } from '../../reducers/driverReducer';
import { borderInputHandler } from '../../lib/handler';

const selectStyles = {
  control: (styles) => ({ ...styles, borderRadius: 'none', border: 'none' }),
  menu: (base) => ({ ...base, textTransform: 'capitalize' }),
};

const SelectDriver = React.forwardRef(
  ({ onChange = null, drivers = [], ...rest }, ref) => {
    const dispatch = useDispatch();
    const pengguna = useSelector((s) => s.pengguna);
    const [selectedDriver, setSelectedDriver] = useState('');
    const options = () => {
      // mengembalikan array kosong jika driver belum init
      // filter driver yang belum softDelete
      const filteredDrivers = drivers.filter((f) => !f.softDelete);
      return filteredDrivers.map((m) => ({
        label: m.nama,
        value: m.id,
        obj: m,
      }));
    };

    const onChangeHandler = (value) => {
      setSelectedDriver(value.obj);
      onChange && onChange(value.obj);
    };

    return (
      <>
        <Select
          styles={selectStyles}
          className={`border ${borderInputHandler(selectedDriver)}`}
          options={options()}
          onChange={onChangeHandler}
          {...rest}
        />
      </>
    );
  }
);
SelectDriver.displayName = 'Select Driver';
export default SelectDriver;
