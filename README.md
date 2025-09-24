# Martial Arts Kiosk 🥋

A modern, touch-friendly check-in kiosk for martial arts dojos, built with React and Supabase. Perfect for tracking student attendance with a beautiful, intuitive interface.

## Features

- 🎯 **Touch-friendly Interface**: Optimized for tablet/kiosk displays
- 👥 **Student Management**: Add, edit, and manage student profiles
- ✅ **Quick Check-in**: One-tap check-in with visual feedback
- 🏆 **Badge System**: Bronze, Silver, and Gold badges based on class count
- 🔍 **Search Functionality**: Find students quickly by name
- 📊 **Real-time Data**: Powered by Supabase for instant updates
- 🎨 **Beautiful UI**: Modern design with smooth animations
- 📱 **Responsive**: Works on all screen sizes
- 🚀 **Deploy Ready**: Configured for easy Vercel deployment

## Tech Stack

- **Frontend**: React 19, TypeScript, Framer Motion
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Styling**: Inline styles with CSS-in-JS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account (free)

### 1. Clone and Install

```bash
git clone <your-repo>
cd martial-arts-kiosk
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key

### 3. Configure Environment

Create `.env.local`:

```bash
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm start
```

Visit `http://localhost:3000` to see your kiosk!

## Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts and add environment variables
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminPanel.tsx   # Student management interface
│   ├── CheckInKiosk.tsx # Main kiosk interface
│   ├── SearchBar.tsx    # Student search
│   └── StudentCard.tsx  # Individual student display
├── hooks/              # Custom React hooks
│   └── useStudents.ts  # Supabase data management
├── lib/                # Configuration
│   └── supabase.ts     # Supabase client setup
├── services/           # API layer
│   └── database.ts     # Database operations
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── App.tsx             # Main application
```

## Database Schema

- **students**: Student profiles with class counts and badges
- **attendance_records**: Check-in history and statistics

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### Customization

- **Student Data**: Edit `supabase/schema.sql` to modify sample data
- **Styling**: Update inline styles in components
- **Badges**: Modify badge thresholds in `src/utils/badgeSystem.ts`

## API Reference

### Student Operations

```typescript
// Get all students
const students = await studentService.getAllStudents();

// Add new student
const newStudent = await studentService.addStudent({
  name: "John Doe",
  avatar: "🥋",
  pin: "1234",
  classesCount: 0,
  isActive: true
});

// Check in student
const updatedStudent = await studentService.checkInStudent(studentId);

// Update student
await studentService.updateStudent(studentId, { name: "New Name" });

// Delete student
await studentService.deleteStudent(studentId);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Check the [Supabase Setup Guide](SUPABASE_SETUP.md)
- Open an issue on GitHub
- Review the troubleshooting section in the setup guide

---

Built with ❤️ for martial arts communities worldwide.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
