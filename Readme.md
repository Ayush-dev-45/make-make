# AI-Powered Website Generator

A web application that allows users to generate websites using AI. The backend processes user prompts via the Claude API to generate structured steps for website creation, which are then implemented dynamically on the frontend. The application utilizes web containers to host generated websites directly in the browser, reducing computation and server dependency.

## 🚀 Features

- **AI-Driven Website Generation**: Uses Claude API to analyze user prompts and generate step-by-step instructions.
- **Web Container Hosting**: Websites are hosted directly in the browser, eliminating backend hosting requirements.
- **Dynamic Frontend Rendering**: React dynamically displays generated steps and executes code in real-time.
- **Full-Stack Implementation**: Built using Node.js (backend) and React.js (frontend) for a seamless user experience.
- **Intuitive File Explorer**: Allows users to view generated files and code structure easily.

## 🏗️ Architecture

1. **User Input**: The user enters a prompt describing the website they want to generate.
2. **Backend Processing**: The backend sends the prompt to the Claude API and parses the response into structured steps.
3. **Frontend Execution**: The frontend dynamically renders the steps and executes code inside a web container.
4. **Website Hosting**: The generated website runs directly in the user's browser without requiring external servers.

## 📦 Tech Stack

- **Frontend**: React.js, Web Containers
- **Backend**: Node.js, Express.js
- **AI Integration**: Claude API for generating website creation steps

## 🔧 Installation & Usage

1. **Clone the Repository**
   ```sh
   git clone <repo-url>
   cd ai-website-generator

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Run the Backend**
    ```sh
    npm run dev
    ```

4. **Run the Frontend**
    ```sh
    npm run dev

Future Enhancements:
- Add a database to store user prompts and generated websites
- Add a feature to allow users to customize the generated website
- Add a feature to allow users to download the generated website
- Add a feature to allow users to share the generated website with others

