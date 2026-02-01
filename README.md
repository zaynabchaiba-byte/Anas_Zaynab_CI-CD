# 🚗 Vehicle CLI – CI/CD Project

CLI tool to interact with a **vehicle-server** via HTTP.  
This project allows you to **list**, **create**, and **delete vehicles** from the command line, with a configurable server address.

Developed as part of the **CI/CD course project**.

---

## 👥 Team

- Anas  
- Zaynab  

---

## 🛠️ Tech Stack

- Node.js ≥ 20
- TypeScript
- Commander (CLI framework)
- Vitest (testing)
- ESLint (linting)
- Docker
- GitHub Actions (CI)

---

## 📦 Installation (local)

Clone the repository and install dependencies:
```bash
git clone https://github.com/zaynabchaiba-byte/Anas_Zaynab_CI-CD.git
cd Anas_Zaynab_CI-CD
npm ci
```

---

## 🔧 Available Scripts
```bash
npm run build    # Compile TypeScript into dist/
npm run dev      # Run CLI in dev mode
npm start        # Run compiled CLI
npm run lint     # Lint source code
npm test         # Run tests
```

---

## 🚀 Usage (local)

Build the project:
```bash
npm run build
```

Run the CLI:
```bash
node dist/index.js --help
```

Or install the CLI globally:
```bash
npm link
vehicle-cli --help
```

---

## 📌 CLI Commands (examples)

List vehicles:
```bash
vehicle-cli list-vehicles --address http://localhost:3000
```

Create a vehicle:
```bash
vehicle-cli create-vehicle \
  --shortcode abcd \
  --battery 85 \
  --latitude 48.85 \
  --longitude 2.35 \
  --address http://localhost:3000
```

Delete a vehicle:
```bash
vehicle-cli delete-vehicle abcd --address http://localhost:3000
```

---

## 🐳 Docker Usage

Build the Docker image:
```bash
docker build -t vehicle-cli .
```

Show help:
```bash
docker run --rm vehicle-cli --help
```

Run a command (server running on host machine):

**Windows / macOS**
```bash
docker run --rm vehicle-cli list-vehicles \
  --address http://host.docker.internal:3000
```

**Linux**
```bash
docker run --rm --network host vehicle-cli list-vehicles \
  --address http://localhost:3000
```

---

## 🧪 Testing
```bash
npm test
```

Tests are executed automatically in CI using GitHub Actions.

---

## 🔄 CI/CD Workflow

- Lint & tests on every Pull Request
- Docker image build validation
- Stable branch: main
- Development branch: staging
- Versioning via Git tags (e.g. v1.0.0)

---

## 📁 Project Structure
```
.
├── src/
├── test/
├── dist/
├── Dockerfile
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── README.md
```

---

## 📄 License

ISC
