# SkillStash
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Jimsalm/SkillStash.git)

SkillStash is a web application designed to be a gateway for affordable online learning. It aggregates and displays the best discounted course deals from Udemy, allowing users to easily find and enroll in valuable courses without breaking the bank.

The application features a public-facing side for users to browse and discover courses, and a protected admin panel for managing the course listings.

## Key Features

-   **Curated Course Deals:** A centralized platform for the latest discounted Udemy courses.
-   **Category Browsing:** Easily navigate through various course categories like Development, Graphic Design, and Business.
-   **Detailed Course View:** Get comprehensive information about each course, including description, instructor, price, and included software/technologies.
-   **Direct Affiliate Links:** Seamlessly access the deal on Udemy with the coupon applied automatically.
-   **Responsive Design:** A clean and modern user interface that works beautifully on both desktop and mobile devices.
-   **Admin Panel:** A secure area for administrators to manage the platform's content.
    -   Dashboard with key statistics.
    -   View all listed courses in a table.
    -   Add new courses with detailed information.
    -   (Future): Edit and delete existing courses.

## Tech Stack

-   **Framework:** React with Vite
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS with shadcn/ui components
-   **Routing:** React Router v7
-   **Form Management:** React Hook Form
-   **Schema Validation:** Zod
-   **Linting:** ESLint

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/jimsalm/skillstash.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd skillstash/SkillStash
    ```

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Compiles and bundles the application for production.
-   `npm run lint`: Lints the codebase using ESLint.
-   `npm run preview`: Serves the production build locally for previewing.

## Project Structure

The project follows a standard Vite + React structure. Key directories inside `src/` include:

-   `components/`: Contains reusable React components.
    -   `ui/`: Auto-generated components from shadcn/ui.
    -   `admin/`: Components specific to the admin panel (`AdminLayout`, `AuthContext`).
    -   `CourseCard.tsx`, `Header.tsx`, `Footer.tsx`: Major public-facing components.
-   `pages/`: Contains the main page components for each route.
    -   `admin/`: Pages for the protected admin section.
-   `data/`: Holds static data, such as the mock `courses.ts` file.
-   `lib/`: Contains utility functions, like the `cn` utility for Tailwind CSS classes.
-   `App.tsx`: The root component where all the application routes are defined.
-   `main.tsx`: The main entry point of the application.
