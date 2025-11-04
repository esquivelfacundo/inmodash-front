// Test script para verificar el registro
const testData = {
  email: "test@example.com",
  password: "Test1234!",
  confirmPassword: "Test1234!",
  name: "Test User",
  phone: "1234567890",
  position: "Manager",
  companyName: "Test Company",
  companyTaxId: "12345678",
  companyAddress: "Test Address 123",
  companyCity: "Test City",
  companyState: "Test State",
  companyCountry: "Argentina",
  companyZipCode: "1234",
  companyPhone: "1234567890",
  companyWebsite: "https://test.com"
};

fetch('http://localhost:3975/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
  .then(res => res.json())
  .then(data => console.log('Success:', JSON.stringify(data, null, 2)))
  .catch(err => console.error('Error:', err));
