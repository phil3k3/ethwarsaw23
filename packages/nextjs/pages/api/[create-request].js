// pages/api/create-request.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { githubValue, priceValue } = req.body;
  
      // Execute the create-request.js script with the form data
      // ... (Same code as in the previous instructions)
  
      // Respond with a success message or handle errors
      res.status(200).json({ message: 'Request creation initiated' });
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }
  