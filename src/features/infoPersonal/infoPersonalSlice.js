import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  infoPersons: [],
  infoPersonToEdit: {
    id: 0,
    selected: false,
    title: 'Mr.',
    firstName: '',
    lastName: '',
    birthDate: '',
    nationality: '',
    citizenId: {
      part1: '',
      part2: '',
      part3: '',
      part4: '',
      part5: ''
    },
    gender: '',
    mobilePhoneNumber: {
      callingCode: '+66',
      phoneNumber: ''
    },
    passportNumber: '',
    salary: ''
  }
}

export const infoPersonalSlice = createSlice({
  name: 'infoPersonal',
  initialState,
  reducers: {
    addInfoPerson(state, action) {
      state.infoPersons.push(action.payload)
    },
    setInfoPersons: (state, action) => {
      state.infoPersons = state.infoPersons.map((item) => {
        const updatedItem = {
          ...item,
          selected: action.payload,
        };
  
        return updatedItem;
      });
    },
    toggleInfoPerson: (state, action) => {
      state.infoPersons = state.infoPersons.map((item) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            selected: !item.selected,
          };
 
          return updatedItem;
        }
 
        return item;
      });
    },
    updateInfoPerson: (state, action) => {
      state.infoPersons = state.infoPersons.map((item) => {
        if (item.id === action.payload.id) {
          const updatedItem = {
            ...item,
            ...action.payload,
          };
 
          return updatedItem;
        }
 
        return item;
      });
    },
    removeInfoPerson: (state, action) => {
      state.infoPersons = state.infoPersons.filter((item) => item.id !== action.payload.id);
    },
    removeInfoPersons: (state) => {
      state.infoPersons = state.infoPersons.filter((item) => !item.selected);
    },
    setInfoPersonToEdit: (state, action) => {
      state.infoPersonToEdit = Object.assign({}, action.payload);
    },
    resetInfoPersonToEdit: (state) => {
      state.infoPersonToEdit = Object.assign({}, {
        id: 0,
        selected: false,
        title: 'Mr.',
        firstName: '',
        lastName: '',
        birthDate: '',
        nationality: '',
        citizenId: {
          part1: '',
          part2: '',
          part3: '',
          part4: '',
          part5: ''
        },
        gender: '',
        mobilePhoneNumber: {
          callingCode: '+66',
          phoneNumber: ''
        },
        passportNumber: '',
        salary: ''
      });
    }
  }
})

export const { addInfoPerson, setInfoPersons, toggleInfoPerson, updateInfoPerson, removeInfoPerson, removeInfoPersons, setInfoPersonToEdit, resetInfoPersonToEdit } = infoPersonalSlice.actions

export const selectInfoPersons = state => state.infoPersonal.infoPersons;
export const selectInfoPersonToEdit = state => state.infoPersonal.infoPersonToEdit;
export const selectInfoPersonsTotal = state => state.infoPersonal.infoPersons.length;

export default infoPersonalSlice.reducer;