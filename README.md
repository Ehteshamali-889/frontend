# Document Management System Frontend

This is the frontend application for the Document Management System, built with Next.js and PrimeReact.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001  # Replace with your backend API URL
```

## Running the Frontend

### Development Mode
To run the application in development mode with hot reloading:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
To create a production build:

```bash
npm run build
npm start
```

## Features

### Authentication
- Sign in and sign up functionality
- JWT-based authentication
- Protected routes

### Document Management
- View list of documents
- Upload new documents
- View document details
- Download documents

### Simulated Summarization
The application includes a simulated document summarization feature that:
- Processes uploaded documents
- Generates a summary of the document content
- Displays the summary alongside the document
- Updates the summary in real-time as the document is modified

## Known Issues and Limitations

1. **Authentication**
   - Token refresh mechanism is not implemented
   - Session persistence relies on localStorage

2. **Document Processing**
   - Large file uploads may timeout
   - Limited file format support
   - Maximum file size: 10MB

3. **Summarization**
   - Currently uses a simulated summarization service
   - Processing time may vary based on document size
   - Limited language support

## Tech Stack

- Next.js 15.3.3
- React 19
- PrimeReact 10.9.6
- TypeScript
- SASS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
