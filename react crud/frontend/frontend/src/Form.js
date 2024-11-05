import React, { useState, useEffect } from 'react';

function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phno, setPhno] = useState('');
  const [address, setAddress] = useState('');
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { firstName, lastName, phno, address };

    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Data received: ${JSON.stringify(data)}`);
        // Clear the form fields
        setFirstName('');
        setLastName('');
        setPhno('');
        setAddress('');
        // Fetch the updated data
        fetch('http://localhost:5000/data')
          .then(response => response.json())
          .then(data => setData(data))
          .catch(error => console.error('Error fetching data: ', error));
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form');
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = { firstName, lastName, phno, address };

    try {
      const response = await fetch(`http://localhost:5000/update/${selectedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Data updated: ${JSON.stringify(data)}`);
        // Clear the form fields
        setFirstName('');
        setLastName('');
        setPhno('');
        setAddress('');
        setSelectedId(null);
        // Fetch the updated data
        fetch('http://localhost:5000/data')
          .then(response => response.json())
          .then(data => setData(data))
          .catch(error => console.error('Error fetching data: ', error));
      } else {
        alert('Error updating form');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating form');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Data deleted');
        // Fetch the updated data
        fetch('http://localhost:5000/data')
          .then(response => response.json())
          .then(data => setData(data))
          .catch(error => console.error('Error fetching data: ', error));
      } else {
        alert('Error deleting data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting data');
    }
  };

  const isFormValid = () => {
    const isFirstNameValid = firstName.length > 1;
    const isLastNameValid = lastName.length > 1;
    const isPhnoValid = /^\d{10}$/.test(phno);
    return isFirstNameValid && isLastNameValid && isPhnoValid;
  };

  const handleEdit = (item) => {
    setFirstName(item.firstName);
    setLastName(item.lastName);
    setPhno(item.phno);
    setAddress(item.address);
    setSelectedId(item.id);
  };

  return (
    <div className='common'>
      <div className='form-row'>
        <div className='form-group'>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phno}
            onChange={(e) => setPhno(e.target.value)}
            required
          />
        </div>
      </div>
      <div className='form-row'>
        <div className='form-group'>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>
      <div className='button'>
        <button  type="submit" onClick={selectedId ? handleUpdate : handleSubmit} disabled={!isFormValid()}>
          {selectedId ? 'Update' : 'Submit'}
        </button>
        {!isFormValid() && (
          <div className="warning-text">
            Please enter a valid first name, last name, and a 10-digit phone number.
          </div>
        )}
      </div>
      <div className='list'>
        <h2>Data's entered</h2>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.phno}</td>
                <td>{item.address}</td>
                <td className="button-group">
                  <button className='button1'onClick={() => handleEdit(item)}>Edit</button>
                  <button className='button1'onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Form;
