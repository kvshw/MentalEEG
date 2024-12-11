# MentalEEG - Employee Mental Workload Management

A comprehensive web application for monitoring and managing employee mental workload using EEG data.

## Features

- User Authentication (Login/Register)
- Dashboard with Real-time EEG Data Visualization
- Employee Well-being Monitoring
- Department Overview
- Project Assignment Management
- Support Resources and Chat Interface

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- React Query
- Recharts for Data Visualization

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL (SQLite for development)
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- pip

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Development

1. Run the backend server
2. Run the frontend development server
3. Access the application at http://localhost:3000

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 