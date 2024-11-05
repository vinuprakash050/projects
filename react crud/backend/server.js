import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;
import cors from 'cors';
import db from './firebaseConfig.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(json());

// Initialize a counter for serial numbers
let serialNumber = 1;

app.post('/submit', async (req, res) => {
  const {
    firstName = 'John',
    lastName = 'Doe',
    phno = '1234567890',
    address = '123 Main St'
  } = req.body;

  const formData = { firstName, lastName, phno, address };

  try {
    // Use the phone number as part of the document ID
    const docId = `${phno}`;
    await db.collection('formData').doc(docId).set(formData);
    console.log('Document written with ID: ', docId);

    // Increment the serial number for the next document
    serialNumber++;

    res.json({ id: docId, ...formData });
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).send('Error saving data');
  }
});
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phno, address } = req.body;
  
    try {
      await db.collection('formData').doc(id).update({ firstName, lastName, phno, address });
      console.log('Document updated with ID: ', id);
      res.json({ id, firstName, lastName, phno, address });
    } catch (error) {
      console.error('Error updating document: ', error);
      res.status(500).send('Error updating data');
    }
  });
  

app.get('/data', async (req, res) => {
  try {
    const snapshot = await db.collection('formData').get();
    const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(dataList);
  } catch (error) {
    console.error('Error retrieving data: ', error);
    res.status(500).send('Error retrieving data');
  }
});
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await db.collection('formData').doc(id).delete();
      console.log('Document deleted with ID: ', id);
      res.json({ id });
    } catch (error) {
      console.error('Error deleting document: ', error);
      res.status(500).send('Error deleting data');
    }
  });
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
