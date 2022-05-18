import React, { useImperativeHandle, useState } from 'react';
import AsyncSelect from 'react-select/async';
import PelangganService from '../../services/pelanggan';
import { useSelector } from 'react-redux';

const selectStyles = {
  control: (styles) => ({ ...styles, borderRadius: 'none', border: 'none' }),
  menu: (base) => ({ ...base, textTransform: 'capitalize' }),
};

const SelectPelanggan = React.forwardRef(
  ({ onChange = null, ...args }, ref) => {
    const pengguna = useSelector((s) => s.pengguna);

    const [selectedPelanggan, setSelectedPelanggan] = useState([]);
    const onChangeHandler = (selected) => {
      setSelectedPelanggan(selected || []);
      onChange && onChange(selected);
    };
    const loadOptions = async (inputText, callback) => {
      const response = await PelangganService.like(inputText, pengguna?.token);
      callback(response.map((i) => ({ label: i.nama, value: i.id, obj: i })));
    };

    useImperativeHandle(ref, () => ({
      getValue: () => selectedPelanggan,
    }));

    return (
      <AsyncSelect
        cacheOptions
        styles={selectStyles}
        className='flex-grow border-2 shadow-lg'
        value={selectedPelanggan}
        onChange={onChangeHandler}
        placeholder='Pelanggan..'
        loadOptions={loadOptions}
        isClearable
        {...args}
      />
    );
  }
);

SelectPelanggan.displayName = 'Select Pelanggan';

export default SelectPelanggan;
