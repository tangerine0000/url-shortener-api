# URL Shortener API

A RESTful API service that shortens long URLs into more manageable short URLs. Built with Node.js, Express, and MongoDB.

## Features

- Create short URLs from long URLs
- Redirect short URLs to original URLs
- Track URL statistics (clicks, creation date, last accessed)
- Update and delete short URLs
- Duplicate URL detection

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or accessible via connection string)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/url-shortener-api.git
cd url-shortener-api
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
```

For the frontend, create a `.env` file with:
```
API_URL=http://localhost:3000
```

4. Start the backend server:
```bash
cd backend
npm run dev
```

5. Start the frontend:
```bash
cd frontend
npm start
```

The backend will be available at http://localhost:3000 and the frontend at http://localhost:5000

## API Endpoints

- `POST /shorten` - Create a new short URL
- `GET /shorten/:shortCode` - Redirect to original URL
- `PUT /shorten/:shortCode` - Update a short URL
- `DELETE /shorten/:shortCode` - Delete a short URL
- `GET /shorten/:shortCode/stats` - Get URL statistics

## Testing

Run the test suite:
```bash
./api_manual_test.sh
```

## Deployment

### Backend Deployment
1. Set up environment variables in your hosting platform (Render/Railway):
   - `PORT`: Port number (usually handled by platform)
   - `BASE_URL`: Your backend domain
   - `FRONTEND_URL`: Your frontend domain
   - `MONGODB_URI`: Your MongoDB connection string

### Frontend Deployment
1. Set up environment variables in your hosting platform (Netlify):
   - `API_URL`: Your backend API URL

## License

MIT 