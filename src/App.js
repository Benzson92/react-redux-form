import React from 'react';
import FormInfoPersonal from './features/infoPersonal/FormInfoPersonal';
import ListInfoPersons from './features/infoPersonal/ListInfoPersons';

import { Container } from 'reactstrap';

function App() {
  return (
    <Container className="py-4">
      <FormInfoPersonal />
      <div className="my-4" />
      <ListInfoPersons />
    </Container>
  );
}

export default App;
