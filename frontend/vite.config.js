import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'construction-ai-pm';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? `/${repoName}/` : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
