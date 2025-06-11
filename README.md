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
The application includes a simulated document summarization feature that demonstrates how AI-powered summarization would work without actually using AI APIs. Here's how it works:

1. **Template-Based Generation**
   - Uses a predefined set of professional summary templates
   - Randomly selects appropriate templates based on document context
   - Templates cover common document types and purposes

2. **Smart Content Extraction**
   - Extracts key information from document descriptions
   - Creates summaries using the first 30 words of document descriptions
   - Alternates between template-based and content-based summaries

3. **Realistic Simulation**
   - Simulates processing delay (1 second) to mimic AI processing time
   - Provides consistent, professional-looking summaries
   - Maintains context awareness based on document metadata

4. **Implementation Details**
   - No external API calls required
   - Works entirely client-side
   - Zero latency and no API costs
   - Perfect for demonstration and testing purposes

This simulation approach allows us to:
- Demonstrate AI-like functionality without actual AI integration
- Test the UI/UX of summarization features
- Provide immediate feedback to users
- Avoid API costs during development
- Work offline without external dependencies

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
