#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Starting URL Shortener API Tests..."
echo "--------------------------------"

# Test 1: Create a new short URL
echo -e "\n${GREEN}Test 1: Creating a new short URL${NC}"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com"}')
echo "Response: $CREATE_RESPONSE"

# Extract shortCode from response
SHORT_CODE=$(echo $CREATE_RESPONSE | grep -o '"shortUrl":"[^"]*' | cut -d'/' -f4)
echo "Generated short code: $SHORT_CODE"

# Test 2: Try to create the same URL again (should return existing URL)
echo -e "\n${GREEN}Test 2: Creating duplicate URL${NC}"
curl -s -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.example.com"}'

# Test 3: Get URL statistics
echo -e "\n${GREEN}Test 3: Getting URL statistics${NC}"
curl -s -X GET http://localhost:3000/shorten/$SHORT_CODE/stats

# Test 4: Update the short URL
echo -e "\n${GREEN}Test 4: Updating short URL${NC}"
curl -s -X PUT http://localhost:3000/shorten/$SHORT_CODE \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.updated-example.com"}'

# Test 5: Try to access the short URL (should redirect)
echo -e "\n${GREEN}Test 5: Accessing short URL${NC}"
curl -s -I http://localhost:3000/shorten/$SHORT_CODE

# Test 6: Get updated statistics
echo -e "\n${GREEN}Test 6: Getting updated statistics${NC}"
curl -s -X GET http://localhost:3000/shorten/$SHORT_CODE/stats

# Test 7: Delete the short URL
echo -e "\n${GREEN}Test 7: Deleting short URL${NC}"
curl -s -X DELETE http://localhost:3000/shorten/$SHORT_CODE

# Test 8: Try to get statistics for deleted URL
echo -e "\n${GREEN}Test 8: Getting statistics for deleted URL${NC}"
curl -s -X GET http://localhost:3000/shorten/$SHORT_CODE/stats

# Test 9: Test invalid URL creation
echo -e "\n${GREEN}Test 9: Testing invalid URL creation${NC}"
curl -s -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": ""}'

echo -e "\n--------------------------------"
echo "Test suite completed!"
