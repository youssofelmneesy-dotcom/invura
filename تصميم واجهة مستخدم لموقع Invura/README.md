
  # تصميم واجهة مستخدم لموقع Invura

  This is a code bundle for تصميم واجهة مستخدم لموقع Invura. The original project is available at https://www.figma.com/design/n5JPGDBpVNspiNZXDOpr6h/%D8%AA%D8%B5%D9%85%D9%8A%D9%85-%D9%88%D8%A7%D8%AC%D9%87%D8%A9-%D9%85%D8%B3%D8%AA%D8%AE%D8%AF%D9%85-%D9%84%D9%85%D9%88%D9%82%D8%B9-Invura.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Deploy on GitHub Pages

  1. Push this project to a GitHub repository.
  2. Go to repository settings > Pages.
  3. In Build and deployment, choose Source: GitHub Actions.
  4. Push to `main` branch (or run the workflow manually from Actions tab).
  5. After deployment completes, open the Pages URL shown in the workflow.

  Notes:
  - The workflow file is already included at `.github/workflows/deploy-pages.yml`.
  - Frontend routes are supported with a `404.html` SPA fallback.
  - This project now supports `Frontend-only` mode on GitHub Pages using local mock data and LocalStorage.
  - You can force frontend-only mode locally by setting `VITE_FRONTEND_ONLY=true`.
  