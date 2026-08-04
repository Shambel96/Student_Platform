# 🎓 Student Platform API

A RESTful backend for a student platform that lets teachers create and manage courses, assignments, announcements and materials, while students enroll in courses, view resources and submit assignments online.

> **Note:** This repository currently contains only the backend. A frontend can be added later and consume the API documented here.

---

## ✨ Features

- 🔐 **Authentication & Authorization** — JWT-based register/login with role-based access control (`Student`, `Teacher`, `Admin`, `Parent`).
- 📚 **Course Management** — teachers and admins can create, update and delete courses.
- 📝 **Assignments & Submissions** — teachers publish assignments with due dates; enrolled students submit (and re-submit) work; teachers grade and give feedback.
- 📢 **Announcements** — course announcements posted by teachers.
- 📄 **Materials** — teachers share files/links for each course.
- 🧑‍🎓 **Enrollment** — students enroll themselves or are enrolled by teachers/admins; enrollment is enforced when accessing course resources.
- 🗂️ **Clean Architecture** — separated layers: `models` → `repository` → `services` → `controllers` → `routers`.
- 📊 **Swagger UI** — auto-generated interactive API documentation.

---

## 🛠️ Tech Stack

| Layer       | Technology                                  |
| ----------- | ------------------------------------------- |
| Runtime     | [Node.js](https://nodejs.org/) (Express 5)  |
| Framework   | [Express](https://expressjs.com/)           |
| Database    | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| Auth        | [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) + [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| API Docs    | [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) |
| Dev         | [nodemon](https://www.npmjs.com/package/nodemon) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18+**
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [npm](https://www.npmjs.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shamble96/Student_Platform.git
cd Student_Platform/Backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Edit .env and set your values (see Configuration table below)

# 5. Start the server
npm run dev        # development (auto-reload)
# or
npm start          # production
```

The server will start on `http://localhost:3333` (or the port you set in `.env`).

### Configuration

Copy `.env.example` to `.env` and set the following variables:

| Variable      | Description                                      | Default                     |
| ------------- | ------------------------------------------------ | --------------------------- |
| `PORT`        | Port the server runs on                          | `3333`                      |
| `MONGO_URI`   | MongoDB connection string                        | `mongodb://127.0.0.1:27017/student_platform` |
| `JWT_SECRET`  | Secret key used to sign JWT tokens               | *(required)*                |
| `JWT_EXPIRE`  | Token lifetime (e.g. `30d`, `7d`, `2h`)          | `30d`                       |

---

## 📖 API Documentation

Once the server is running, open the interactive Swagger UI:

```
http://localhost:3333/api-docs
```

### Role-based access summary

| Role      | Can do                                                                  |
| --------- | ----------------------------------------------------------------------- |
| Student   | Enroll in courses, view enrolled course resources, submit assignments   |
| Teacher   | Create/manage their own courses, assignments, announcements, materials, grade submissions |
| Admin     | Everything a teacher can do, plus full access to all courses            |
| Parent    | Reserved for future use                                                  |

### Endpoints overview

#### Auth — `/api/auth`
| Method | Endpoint               | Access  |
| ------ | ---------------------- | ------- |
| POST   | `/api/auth/register`   | Public  |
| POST   | `/api/auth/login`      | Public  |
| GET    | `/api/auth/me`         | Private |

#### Courses — `/api/courses`
| Method | Endpoint               | Access           |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/courses`         | Private          |
| POST   | `/api/courses`         | Teacher, Admin   |
| GET    | `/api/courses/:id`     | Private          |
| PUT    | `/api/courses/:id`     | Teacher, Admin   |
| DELETE | `/api/courses/:id`     | Teacher, Admin   |

#### Enrollments — `/api/courses/:courseId/enrollments`
| Method | Endpoint               | Access           |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/courses/:courseId/enrollments`                    | Private          |
| POST   | `/api/courses/:courseId/enrollments`                    | Student, Teacher, Admin |
| DELETE | `/api/courses/:courseId/enrollments/:studentId`         | Teacher, Admin   |

#### Assignments — `/api/courses/:courseId/assignments` & `/api/assignments`
| Method | Endpoint               | Access           |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/assignments`                          | Private          |
| GET    | `/api/assignments/:id`                      | Private          |
| PUT    | `/api/assignments/:id`                      | Teacher, Admin   |
| DELETE | `/api/assignments/:id`                      | Teacher, Admin   |
| GET    | `/api/courses/:courseId/assignments`        | Private          |
| POST   | `/api/courses/:courseId/assignments`        | Teacher, Admin   |

#### Submissions — `/api/assignments/:assignmentId/submissions`
| Method | Endpoint               | Access           |
| ------ | ---------------------- | ---------------- |
| POST   | `/api/assignments/:assignmentId/submissions`                    | Student          |
| GET    | `/api/assignments/:assignmentId/submissions`                    | Teacher, Admin   |
| GET    | `/api/assignments/:assignmentId/submissions/my-submission`      | Student          |
| PUT    | `/api/assignments/:assignmentId/submissions/:submissionId/grade` | Teacher, Admin  |

#### Announcements — `/api/courses/:courseId/announcements`
| Method | Endpoint               | Access           |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/courses/:courseId/announcements`       | Private          |
| POST   | `/api/courses/:courseId/announcements`       | Teacher, Admin   |
| DELETE | `/api/courses/:courseId/announcements/:id`   | Teacher, Admin   |

#### Materials — `/api/courses/:courseId/materials`
| Method | Endpoint               | Access           |
| ------ | ---------------------- | ---------------- |
| GET    | `/api/courses/:courseId/materials`           | Private          |
| POST   | `/api/courses/:courseId/materials`           | Teacher, Admin   |
| DELETE | `/api/courses/:courseId/materials/:id`       | Teacher, Admin   |

#### Students — `/api/students`
| Method | Endpoint               | Access  |
| ------ | ---------------------- | ------- |
| GET    | `/api/students/my-courses`                               | Student |
| GET    | `/api/students/courses/:courseId`                        | Student |
| POST   | `/api/students/assignments/:assignmentId/submit`         | Student |
| GET    | `/api/students/assignments/:assignmentId/submission`     | Student |

> All endpoints except `register` and `login` require a Bearer token:
> ```
> Authorization: Bearer <your_jwt_token>
> ```

---

## 📁 Project Structure

```
Student_Platform/
└── Backend/
    ├── config/            # Database connection
    ├── controllers/       # Request handlers (thin layer over services)
    ├── middlewares/       # Auth (JWT), role authorization, student enrollment guards
    ├── models/            # Mongoose schemas (User, Course, Assignment, ...)
    ├── repository/        # Data-access layer
    ├── routers/           # Express route definitions
    ├── services/          # Business logic
    ├── swagger/           # OpenAPI specification (swagger.yaml)
    ├── app.js             # Express app setup + middleware + route mounting
    ├── server.js          # Server entry point
    └── .env.example       # Environment variable template
```

---

## 📜 Available Scripts

| Script        | Description                                |
| ------------- | ------------------------------------------ |
| `npm start`   | Run the server in production mode          |
| `npm run dev` | Run the server with nodemon (auto-reload)  |

---

## 🧪 Example Request

```bash
# Register a user
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@example.com", "password": "password123", "role": "Student"}'

# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Get authenticated user
curl http://localhost:3333/api/auth/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`.
3. Commit your changes: `git commit -m "Add my feature"`.
4. Push to the branch: `git push origin feature/my-feature`.
5. Open a pull request.

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

## 👤 Author

**Shambel Dechu**

- GitHub: [@Shambel96](https://github.com/Shambel96)
