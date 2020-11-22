import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  setInfoPersons,
  selectInfoPersons,
  toggleInfoPerson,
  removeInfoPerson,
  removeInfoPersons,
  setInfoPersonToEdit,
  selectInfoPersonsTotal,
} from './infoPersonalSlice'
import store, { saveToLocalStorage } from '../../app/store';

import { Table, Button, Input, Label, Pagination, PaginationItem } from 'reactstrap';

const pageSize = 5;

const ListInfoPersons = () => {
  const infoPersons = useSelector(selectInfoPersons);
  const infoPersonsTotal = useSelector(selectInfoPersonsTotal);
  const dispatch = useDispatch();

  const [displayedPersons, setDisplayedPersons] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);

  const pageCount = React.useMemo(() => {
    const total = parseInt(infoPersonsTotal, 10);
    return Math.ceil(total / pageSize);
  }, [infoPersonsTotal]);

  function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  const handleSelectItem = (item) => {
    dispatch(toggleInfoPerson(item));
  };

  const handleSelectAll = (event) => {
    dispatch(setInfoPersons(event.target.checked));
  };

  const handleDeleteSelected = () => {
    dispatch(removeInfoPersons());
    saveToLocalStorage(store.getState());
  };

  const handleDeleteItem = (item) => {
    dispatch(removeInfoPerson(item));
    saveToLocalStorage(store.getState());
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
    setDisplayedPersons(paginate(infoPersons, pageSize, page));
  }

  React.useEffect(() => {
    setCurrentPage(1);
    setDisplayedPersons(paginate(infoPersons, pageSize, 1));
  }, [infoPersons]);

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex mb-3">
          <div className="mr-4 d-flex">
            <Label check className="d-flex align-items-center">
              <Input
                type="checkbox"
                className="d-flex m-0 mr-2 position-relative"
                onChange={ (event) => handleSelectAll(event) }
              /> Select All
            </Label>
          </div>
          <div className="d-flex">
            <Button
              disabled={ !displayedPersons.find(item => item.selected) }
              color="danger"
              onClick={ () => handleDeleteSelected() }
            >
              DELETE
            </Button>
          </div>
        </div>
        <div className="d-flex">
          <Pagination aria-label="page-navigation" className="d-flex">
            <PaginationItem className="mr-2 d-flex">
              <Button
                disabled={ currentPage === 1}
                color="primary"
                onClick={ () => handleChangePage(currentPage - 1) }
              >
                PREV
              </Button>
            </PaginationItem>
            { Array(pageCount).fill(null).map((_, index) => (
              <PaginationItem
                key={ index }
                active={ currentPage === index + 1 }
                className="d-flex"
                onClick={ () => handleChangePage(index + 1) }
              >
                <Button
                  color="link"
                  className={ [
                    currentPage === index + 1 ? 'text-primary font-weight-bold' : 'text-dark',
                    'p-1 m-1'
                  ].join(' ') }
                >
                  { index + 1 }
                </Button>
              </PaginationItem>
            )) }
            <PaginationItem className="ml-2 d-flex">
              <Button
                disabled={ currentPage === pageCount}
                color="primary"
                onClick={ () => handleChangePage(currentPage + 1) }
              >
                NEXT
              </Button>
            </PaginationItem>
          </Pagination>
        </div>
      </div>
      <Table responsive>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Gender</th>
            <th>Mobile Phone</th>
            <th>Nationality</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { displayedPersons.map((item, index) => (
            <tr
              key={ index }
            >
              <td className="position-relative">
                <Input
                  type="checkbox"
                  className="w-75 d-flex mx-auto"
                  checked={ item.selected }
                  onChange={ () => handleSelectItem(item) }
                />
              </td>
              <td>
                { `${item.firstName} ${item.lastName}` }
              </td>
              <td>
                { item.gender ? item.gender : 'N/A' }
              </td>
              <td>
                { `${item.mobilePhoneNumber.callingCode}${item.mobilePhoneNumber.phoneNumber}` }
              </td>
              <td>
                { item.nationality ? item.nationality : 'N/A' }
              </td>
              <td>
                <Button
                  color="primary"
                  onClick={ () => dispatch(setInfoPersonToEdit(item)) }
                >
                  EDIT
                </Button>
                <span className="mx-4">/</span>
                <Button
                  color="danger"
                  onClick={ () => handleDeleteItem(item) }
                >
                  DELETE
                </Button>
              </td>
            </tr>
          )) }
        </tbody>
      </Table>
    </div>
  );
}

export default ListInfoPersons;
