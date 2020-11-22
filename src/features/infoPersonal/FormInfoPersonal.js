import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { Col, Row, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';

import { addInfoPerson, updateInfoPerson, resetInfoPersonToEdit, selectInfoPersons, selectInfoPersonToEdit } from './infoPersonalSlice'
import store, { saveToLocalStorage } from '../../app/store';

dayjs.extend(customParseFormat);

const personPrefixes = ['Mr.', 'Miss', 'Mrs.'];
const countries = [
  {
    nationality: 'Thai',
    flag: '🇹🇭',
    callingCode: '+66'
  },
  {
    nationality: 'American',
    flag: '🇺🇸',
    callingCode: '+1'
  },
  {
    nationality: 'British',
    flag: '🇬🇧',
    callingCode: '+44'
  }
];

const FormInfoPersonal = (props) => {
  const infoPersons = useSelector(selectInfoPersons);
  const infoPersonToEdit = useSelector(selectInfoPersonToEdit);
  const dispatch = useDispatch();

  const [title, setTitle] = React.useState('Mr.');
  const [isTitleValid, setIsTitleValid] = React.useState(true);

  const [firstName, setFirstName] = React.useState('');
  const [isFirstNameValid, setIsFirstNameValid] = React.useState(true);

  const [lastName, setLastName] = React.useState('');
  const [isLastNameValid, setIsLastNameValid] = React.useState(true);

  const [birthDate, setBirthDate] = React.useState('');
  const [isBirthDateValid, setIsBirthDateValid] = React.useState(true);

  const [nationality, setNationality] = React.useState('');

  const [citizenId, setCitizenId] = React.useState({
    part1: '',
    part2: '',
    part3: '',
    part4: '',
    part5: ''
  });
  const [isCitizenIdValid, setIsCitizenIdValid] = React.useState({
    part1: true,
    part2: true,
    part3: true,
    part4: true,
    part5: true
  });
  
  const [gender, setGender] = React.useState('');

  const [mobilePhoneNumber, setMobilePhoneNumber] = React.useState({
    callingCode: '+66',
    phoneNumber: ''
  });
  const [isMobilePhoneNumberValid, setIsMobilePhoneNumberValid] = React.useState({
    callingCode: true,
    phoneNumber: true
  });

  const [passportNumber, setPassportNumber] = React.useState('');
  const [isPassportNumberValid, setIsPassportNumberValid] = React.useState(true);

  const [salary, setSalary] = React.useState('');
  const [isSalaryValid, setIsSalaryValid] = React.useState(true);

  const handleCitizenIdChange = (event) => {
		setCitizenId({
			...citizenId,
			[event.target.name]: event.target.value
		});
  };
  
  const handleMobilePhoneNumberChange = (event) => {
		setMobilePhoneNumber({
			...mobilePhoneNumber,
			[event.target.name]: event.target.value
		});
  };

  const checkIsBirthDateValid = () => {
    const now = dayjs();
    const minDate = dayjs().subtract(100, 'year');
    const date = dayjs(birthDate).format('MM-DD-YYYY');
    const dateParse = dayjs(date, 'MM-DD-YYYY');
    const compared = now.diff(dateParse) >= 0 && dateParse.diff(minDate) >= 0;
    return compared;
  };

  const checkIsCitizenIdValid = () => {
    const { part1, part2, part3, part4, part5 } = citizenId;
    
    if (!!part1 || !!part2 || !!part3 || !!part4 || !!part5) {
      return {
        part1: /^\d{1}$/.test(part1),
        part2: /^\d{4}$/.test(part2),
        part3: /^\d{5}$/.test(part3),
        part4: /^\d{2}$/.test(part4),
        part5: /^\d{1}$/.test(part5)
      };
    } else {
      return {
        part1: true,
        part2: true,
        part3: true,
        part4: true,
        part5: true
      };
    }
  }

  const checkIsMobilePhoneNumberValid = () => {
    const { callingCode, phoneNumber } = mobilePhoneNumber;

    return {
      callingCode: !!callingCode,
      phoneNumber: /^\d{10}$/.test(phoneNumber)
    };
  }
  
  const validateForm = () => {
    const isTitleValid = !!title;
    setIsTitleValid(isTitleValid);

    const isFirstNameValid = !!firstName && /^[a-zA-Z]+$/.test(firstName);
    setIsFirstNameValid(isFirstNameValid);

    const isLastNameValid = !!lastName && /^[a-zA-Z]+$/.test(lastName);
    setIsLastNameValid(isLastNameValid);

    const isBirthDateValid = !!birthDate && checkIsBirthDateValid();
    setIsBirthDateValid(isBirthDateValid);

    const isCitizenIdValid = checkIsCitizenIdValid();
    setIsCitizenIdValid({ ...isCitizenIdValid });

    const isMobilePhoneNumberValid = checkIsMobilePhoneNumberValid();
    setIsMobilePhoneNumberValid({ ...isMobilePhoneNumberValid });

    const isPassportNumberValid = !!passportNumber ? /^[A-Z0-9]{9}$/.test(passportNumber) : true;
    setIsPassportNumberValid(isPassportNumberValid);

    const isSalaryValid = !!salary && salary >= 0;
    setIsSalaryValid(isSalaryValid);

    const { part1, part2, part3, part4, part5 } = isCitizenIdValid;
    const { callingCode, phoneNumber } = isMobilePhoneNumberValid;

    return (
      isTitleValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isBirthDateValid &&
      part1 && part2 && part3 && part4 && part5 &&
      callingCode && phoneNumber &&
      isPassportNumberValid &&
      isSalaryValid
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(store.getState());

    const isValid = validateForm();
    if (!isValid) return;
    console.log(isValid);

    const amountInfoPersons = infoPersons.length;
    const id = amountInfoPersons > 0 ? infoPersons[amountInfoPersons - 1].id + 1 : 1;
    const formData = {
      id: !!infoPersonToEdit.firstName ? infoPersonToEdit.id : id,
      selected: false,
      title,
      firstName,
      lastName,
      birthDate,
      nationality,
      citizenId,
      gender,
      mobilePhoneNumber,
      passportNumber,
      salary
    };

    if (!!infoPersonToEdit.firstName) {
      dispatch(updateInfoPerson(formData));
    } else {
      dispatch(addInfoPerson(formData));
    }
    dispatch(resetInfoPersonToEdit());
    saveToLocalStorage(store.getState());
  }

  React.useEffect(() => {
    setTitle(infoPersonToEdit.title);
    setFirstName(infoPersonToEdit.firstName);
    setLastName(infoPersonToEdit.lastName);
    setBirthDate(infoPersonToEdit.birthDate);
    setNationality(infoPersonToEdit.nationality);
    setCitizenId({ ...infoPersonToEdit.citizenId});
    setGender(infoPersonToEdit.gender);
    setMobilePhoneNumber({ ...infoPersonToEdit.mobilePhoneNumber });
    setPassportNumber(infoPersonToEdit.passportNumber);
    setSalary(infoPersonToEdit.salary);
  }, [infoPersonToEdit]);

  return (
    <Form onSubmit={ (event) => handleSubmit(event) }>
      <Row form>
        <Col md={2}>
          <FormGroup row>
            <Label sm={3} className="d-flex">Title: <span className="text-danger">*</span></Label>
            <Col sm={8} className="ml-1">
              <Input
                type="select"
                invalid={ !isTitleValid }
                onChange={ (event) => setTitle(event.target.value) }
                required
              >
                {personPrefixes.map(item => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </Input>
              <FormFeedback>
                Title is required.
              </FormFeedback>
            </Col>
          </FormGroup>
        </Col>
        <Col md={5}>
          <FormGroup row>
            <Label sm={3} className="d-flex">First Name: <span className="text-danger">*</span></Label>
            <Col sm={9}>
              <Input
                type="text"
                placeholder="First Name"
                invalid={ !isFirstNameValid }
                value={ firstName }
                onChange={ (event) => setFirstName(event.target.value) }
                required
              />
              <FormFeedback>
                First name is required with only letters.
              </FormFeedback>
            </Col>
          </FormGroup>
        </Col>
        <Col md={5}>
          <FormGroup row>
            <Label sm={3} className="d-flex">Last Name: <span className="text-danger">*</span></Label>
            <Col sm={9}>
              <Input
                type="text"
                placeholder="Last Name"
                invalid={ !isLastNameValid }
                value={ lastName }
                onChange={ (event) => setLastName(event.target.value) }
                required
              />
              <FormFeedback>
                Last name is required with only letters.
              </FormFeedback>
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <FormGroup row>
            <Label sm={3} className="d-flex">Birthday: <span className="text-danger">*</span></Label>
            <Col sm={9}>
              <Input
                type="date"
                placeholder="mm/dd/yyyy"
                pattern="\d{2}/\d{2}/\d{4}"
                min={ dayjs().subtract(100, 'year').format('YYYY-MM-DD') }
                max={ dayjs().format('YYYY-MM-DD') }
                invalid={ !isBirthDateValid }
                value={ birthDate }
                onChange={ (event) => setBirthDate(event.target.value) }
                required
              />
              <FormFeedback>
                Birthday must be at least 100 years from now and at most today.
              </FormFeedback>
            </Col>
          </FormGroup>
        </Col>
        <Col md={8}>
          <FormGroup row>
            <Label sm={2}>Nationality:</Label>
            <Col sm={6}>
              <Input
                type="select"
                value={ nationality }
                onChange={ (event) => setNationality(event.target.value) }
              >
                <option value="">-- Please Select --</option>
                {countries.map(item => (
                  <option value={item.nationality} key={item.nationality}>
                    {item.nationality}
                  </option>
                ))}
              </Input>
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <FormGroup row className="align-items-center">
        <Label sm>Citizen ID:</Label>
        <Col sm={2}>
          <Input
            type="number"
            name="part1"
            placeholder="1 digit"
            maxLength="1"
            invalid={ !isCitizenIdValid.part1 }
            value={ citizenId.part1 }
            onChange={ (event) => handleCitizenIdChange(event) }
          />
          <FormFeedback>
            (only 1 digit)
          </FormFeedback>
        </Col>
        <div>-</div>
        <Col sm={2}>
          <Input
            type="number"
            name="part2"
            placeholder="4 digits"
            maxLength="4"
            invalid={ !isCitizenIdValid.part2 }
            value={ citizenId.part2 }
            onChange={ (event) => handleCitizenIdChange(event) }
          />
          <FormFeedback>
            (only 4 digits)
          </FormFeedback>
        </Col>
        <div>-</div>
        <Col sm={2}>
          <Input
            type="number"
            name="part3"
            placeholder="5 digits"
            maxLength="5"
            invalid={ !isCitizenIdValid.part3 }
            value={ citizenId.part3 }
            onChange={ (event) => handleCitizenIdChange(event) }
          />
          <FormFeedback>
            (only 5 digits)
          </FormFeedback>
        </Col>
        <div>-</div>
        <Col sm={2}>
          <Input
            type="number"
            name="part4"
            placeholder="2 digits"
            maxLength="2"
            invalid={ !isCitizenIdValid.part4 }
            value={ citizenId.part4 }
            onChange={ (event) => handleCitizenIdChange(event) }
          />
          <FormFeedback>
            (only 2 digits)
          </FormFeedback>
        </Col>
        <div>-</div>
        <Col sm={2}>
          <Input
            type="number"
            name="part5"
            placeholder="1 digit"
            maxLength="1"
            invalid={ !isCitizenIdValid.part5 }
            value={ citizenId.part5 }
            onChange={ (event) => handleCitizenIdChange(event) }
          />
          <FormFeedback>
            (only 1 digit)
          </FormFeedback>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Col sm={2}>Gender:</Col>
        <Col>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="Male"
                value="Male"
                checked={gender === "Male"}
                onChange={ (event) => setGender(event.target.value) }
              />{' '}
              Male
            </Label>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="Female"
                value="Female"
                checked={gender === "Female"}
                onChange={ (event) => setGender(event.target.value) }
              />{' '}
              Female
            </Label>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup check>
            <Label check>
              <Input
                type="radio"
                name="Unisex"
                value="Unisex"
                checked={gender === "Unisex"}
                onChange={ (event) => setGender(event.target.value) }
              />{' '}
              Unisex
            </Label>
          </FormGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label sm={2} className="d-flex">Mobile Phone: <span className="text-danger">*</span></Label>
        <Col sm={2}>
          <Input
            type="select"
            name="callingCode"
            invalid={ !isMobilePhoneNumberValid.callingCode }
            value={ mobilePhoneNumber.callingCode }
            onChange={ (event) => handleMobilePhoneNumberChange(event) }
            required
          >
            {countries.map(item => (
              <option
                value={item.callingCode}
                key={item.callingCode}
              >
                {item.flag}{item.callingCode}
              </option>
            ))}
          </Input>
          <FormFeedback>Phone calling code is required.</FormFeedback>
        </Col>
        <div className="d-flex align-items-center">-</div>
        <Col sm={4}>
          <Input
            type="number"
            name="phoneNumber"
            placeholder="Mobile Phone Number"
            maxLength="10"
            invalid={ !isMobilePhoneNumberValid.phoneNumber }
            value={ mobilePhoneNumber.phoneNumber }
            onChange={ (event) => handleMobilePhoneNumberChange(event) }
            required
          />
          <FormFeedback>Mobile phone number is required with 10 digits.</FormFeedback>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label sm={2}>Passport Number:</Label>
        <Col sm={4}>
          <Input
            type="text"
            placeholder="Passport Number"
            maxLength="9"
            invalid={ !isPassportNumberValid }
            value={ passportNumber }
            onChange={ (event) => setPassportNumber(event.target.value) }
          />
          <FormFeedback>Passport number is required with 9 characters (letters or digits).</FormFeedback>
        </Col>
      </FormGroup>
      <Row>
        <Col md={8}>
          <FormGroup row>
            <Label sm={3} className="d-flex">Expected Salary: <span className="text-danger">*</span></Label>
            <Col sm={4}>
              <Input
                type="number"
                placeholder="Expected Salary"
                invalid={ !isSalaryValid }
                value={ salary }
                onChange={ (event) => setSalary(event.target.value) }
                required
              />
              <FormFeedback>Expected salary is required with a zero or positive number.</FormFeedback>
            </Col>
            <div className="d-flex align-items-center">THB</div>
          </FormGroup>
        </Col>
        <Col md={4}>
          <Button color="primary">SUBMIT</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default FormInfoPersonal;
