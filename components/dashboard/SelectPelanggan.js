import React, { useImperativeHandle, useState } from 'react';
import AsyncSelect from 'react-select/async';
import PelangganService from '../../services/pelanggan';
import { useSelector } from 'react-redux';

const selectStyles = {
  control: (styles) => ({ ...styles, borderRadius: 'none', border: 'none' }),
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
      console.log(response);
      callback(response.map((i) => ({ label: i.nama, value: i.id, obj: i })));
    };

    useImperativeHandle(ref, () => ({
      getValue: () => selectedPelanggan,
    }));

    return (
      <AsyncSelect
        styles={selectStyles}
        className='flex-grow border-2 shadow-lg'
        value={selectedPelanggan}
        onChange={onChangeHandler}
        placeholder='Pilih Pelanggan..'
        loadOptions={loadOptions}
        {...args}
      />
    );
  }
);

SelectPelanggan.displayName = 'Select Pelanggan';

export default SelectPelanggan;
