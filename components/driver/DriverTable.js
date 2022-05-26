import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTable } from 'react-table/dist/react-table.development';
import { removeDriver } from '../../reducers/driverReducer';
import { confirm } from '../Sweetalert2';

const DriverTable = ({ driver, onUpdate }) => {
  const pengguna = useSelector((s) => s.pengguna);

  const ActionsButton = ({ driver }) => {
    const dispatch = useDispatch();
    const updateHandler = () => {
      onUpdate(driver);
    };
    const removeHandler = () => {
      confirm(() => {
        dispatch(removeDriver(driver, pengguna.token));
      });
    };

    return (
      <>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 m-2'>
          <button
            onClick={updateHandler}
            className='btn-dashboard bg-gradient-blue !p-0 text-sm'
          >
            Edit
          </button>
          <button
            onClick={removeHandler}
            className='btn-dashboard bg-gradient-red !p-0 text-sm'
          >
            Hapus
          </button>
        </div>
      </>
    );
  };

  const columns = useMemo(() => {
    return [
      {
        Header: 'Nama',
        accessor: 'col1',
      },
      {
        Header: 'No. HP',
        accessor: 'col2',
      },
      {
        Header: 'Username',
        accessor: 'col3',
        Cell: ({ cell: { value } }) => (
          <span className='lowercase'>{value}</span>
        ),
      },
      {
        Header: 'Menu',
        accessor: 'col4',
      },
    ];
  }, []);

  const data = useMemo(() => {
    const filteredDrivers = driver.filter((f) => !f.softDelete);
    return filteredDrivers.map((d) => ({
      col1: d.nama,
      col2: d.noHP,
      col3: d.akun?.username,
      col4: <ActionsButton driver={d} />,
    }));
  }, [driver]);

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <>
      <div className='my-2'>
        <table className='w-full' {...getTableProps()}>
          <thead className='bg-green-200'>
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => (
                // Apply the header row props
                // eslint-disable-next-line
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column) => (
                      // Apply the header cell props
                      // eslint-disable-next-line
                      <th {...column.getHeaderProps()}>
                        {
                          // Render the header
                          column.render('Header')
                        }
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          {/* Apply the table body props */}
          <tbody className='bg-slate-50' {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  // eslint-disable-next-line
                  <tr className='border' {...row.getRowProps()}>
                    {
                      // Loop over the rows cells
                      row.cells.map((cell) => {
                        // Apply the cell props
                        return (
                          // eslint-disable-next-line
                          <td
                            className='capitalize border'
                            {...cell.getCellProps()}
                          >
                            {
                              // Render the cell contents
                              cell.render('Cell')
                            }
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DriverTable;
