# Linked Posts 🌐

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-blue?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A social media-like web app built with React. Users can create posts with text and images, comment, manage their own posts, and interact with a responsive and modern UI.

## 🚀 Features

- **Home Feed:** View all posts, like, comment, and delete your own posts (with authorization).  
- **Create Posts:** Upload images, live preview before posting, add captions.  
- **My Posts:** See and manage your own posts, moderate comments, and add comments.  
- **Post Details:** Full post view with image, all comments, lazy-loaded images for performance.  
- **Notifications:** Toast messages for post creation, deletion, or errors.  
- **Responsive Design:** Works well on both mobile and desktop screens.  

## 🛠️ Technologies

- React, React Router, React Query  
- Axios for API requests  
- React Hook Form for form handling  
- TailwindCSS for styling  
- react-hot-toast for notifications  
- react-icons for icons  
- react-loading-skeleton for image placeholders  

## 💾 Installation

```bash
git clone https://github.com/yourusername/linked-posts.git
cd linked-posts
npm install
npm start
````

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Folder Structure

```
src/
├─ components/        # Reusable UI components
├─ pages/             # Pages like Home, MyPosts, PostDetails
├─ Context/           # React Context for user/auth data
├─ api/               # Axios API calls
└─ App.jsx            # Main app entry point
```

## 🎯 Usage

* **Home:** View posts from all users, create new posts.
* **My Posts:** Manage your posts and comments.
* **Post Details:** See full post with comments.
* Only authorized users can delete posts.
* Fully responsive for mobile and desktop.

## ⚡ License

MIT ©

