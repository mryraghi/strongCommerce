const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const api_key = 'ge1ae4dduciephky5qhld5vu';
const API = 'https://openapi.etsy.com/v2';

// Get all posts
router.get('/products/trending', (req, res) => {
  // Get products from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/listings/trending?api_key=${api_key}&includes=MainImage`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/products/:listing_id', (req, res) => {
  // Get products from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/listings/${req.params.listing_id}?api_key=${api_key}&includes=MainImage`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

module.exports = router;
