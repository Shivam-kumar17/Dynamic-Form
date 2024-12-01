import React, { useState, useEffect } from 'react';
import './Form.css';

const DynamicForm = () => {
  const [formData, setFormData] = useState([]); // Holds the fields from API response
  const [selectedForm, setSelectedForm] = useState('');
  const [inputValues, setInputValues] = useState({}); // Keeps track of input values
  const [errors, setErrors] = useState({}); // Tracks validation errors
  const [submittedData, setSubmittedData] = useState([]); // Stores submitted form data
  const [progress, setProgress] = useState(0); // Tracks form completion percentage
  const [isSubmitted, setIsSubmitted] = useState(false); // Tracks successful submission

  // Simulated API call
  const apiResponses = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false }
      ]
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        { name: "state", type: "dropdown", label: "State", options: ["California", "Texas", "New York"], required: true },
        { name: "zipCode", type: "text", label: "Zip Code", required: false }
      ]
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }
      ]
    }
  };

  // Handle form selection
  const handleFormSelection = (e) => {
    const formType = e.target.value;
    setSelectedForm(formType);
    if (apiResponses[formType]) {
      setFormData(apiResponses[formType].fields);
      setInputValues({});
      setErrors({});
      setProgress(0);
      setIsSubmitted(false);
    }
  };

  // Handle input change
  const handleChange = (e, field) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });

    // Update progress
    const completedFields = formData.filter(field => field.required && inputValues[field.name]);
    const progressPercentage = (completedFields.length / formData.filter(field => field.required).length) * 100;
    setProgress(progressPercentage);
  };

  // Validate form fields
  const validateFields = () => {
    const newErrors = {};
    formData.forEach(field => {
      if (field.required && !inputValues[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      setSubmittedData([...submittedData, inputValues]);
      setInputValues({});
      setProgress(0);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 2000); // Reset submission animation after 2 seconds
    }
  };

  // Handle delete
  const handleDelete = (index) => {
    const newData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(newData);
    alert("Entry deleted successfully.");
  };

  // Handle edit
  const handleEdit = (index) => {
    const dataToEdit = submittedData[index];
    setInputValues(dataToEdit);
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
    setProgress(0); // Reset progress for editing
  };

  return (
    <div className="dynamic-form">
      <header>
        <h1>Dynamic Form Implementation</h1>
      </header>

      <div className="form-selection">
        <label htmlFor="formType">Select Form Type: </label>
        <select id="formType" onChange={handleFormSelection} value={selectedForm}>
          <option value="">-- Select --</option>
          {Object.keys(apiResponses).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      {formData.length > 0 && (
        <form onSubmit={handleSubmit}>
          {formData.map((field) => (
            <div key={field.name} className="form-group">
              <label htmlFor={field.name}>{field.label}:</label>
              {field.type === "dropdown" ? (
                <select
                  id={field.name}
                  name={field.name}
                  onChange={(e) => handleChange(e, field)}
                  value={inputValues[field.name] || ""}
                >
                  <option value="">-- Select --</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  onChange={(e) => handleChange(e, field)}
                  value={inputValues[field.name] || ""}
                />
              )}
              {errors[field.name] && <span className="error">{errors[field.name]}</span>}
            </div>
          ))}
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <button type="submit">Submit</button>
        </form>
      )}

      {isSubmitted && <div className="success-message">Form submitted successfully!</div>}

      {submittedData.length > 0 && (
        <div className="submitted-data">
          <h2>Submitted Data</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(submittedData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  {Object.values(data).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer>
        <p>Dynamic Form Footer</p>
      </footer>
    </div>
  );
};

export default DynamicForm;
