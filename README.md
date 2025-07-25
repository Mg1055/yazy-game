# 🎲 Yazy Game - Multiplayer Online

A modern, real-time multiplayer implementation of the classic Yazy (Yahtzee) dice game built with React and Supabase.

![Yazy Game Screenshot](https://via.placeholder.com/800x400?text=Yazy+Game+Screenshot)

## ✨ Features

- **Real-time Multiplayer**: Play with friends online with instant updates
- **Complete Yazy Rules**: Full implementation with all scoring categories
- **Modern UI**: Beautiful, responsive design that works on all devices
- **Free to Host**: Deploy for free on Vercel + Supabase
- **Easy Sharing**: Simple game codes to invite friends

## 🎮 How to Play

1. **Create or Join a Game**: Enter your name and create a new game or join with a friend's code
2. **Roll the Dice**: Roll 5 dice up to 3 times per turn
3. **Hold Dice**: Click dice between rolls to keep them
4. **Score Points**: Choose a scoring category for your final dice combination
5. **Complete Categories**: Fill all 13 categories to finish the game
6. **Win**: Player with the highest total score wins!

### Scoring Categories

**Upper Section (Sum of matching dice):**
- Ones, Twos, Threes, Fours, Fives, Sixes
- Bonus: 35 points if upper section totals 63+

**Lower Section (Fixed points):**
- Three of a Kind: Sum of all dice
- Four of a Kind: Sum of all dice  
- Full House: 25 points
- Small Straight: 30 points
- Large Straight: 40 points
- Yazy (5 of a kind): 50 points
- Chance: Sum of all dice

## 🚀 Quick Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd yazy-game-1
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `supabase-schema.sql`
3. Go to Settings > API to get your project URL and anon key

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173` to play locally!

## 🌐 Deploy to Production

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy!

3. **Share Your Game**: Send the Vercel URL to friends and start playing!

### Alternative: Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to [netlify.com](https://netlify.com)
3. Add environment variables in site settings

## 🛠️ Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Die.jsx         # Individual die component
│   ├── Game.jsx        # Main game interface
│   ├── GameLobby.jsx   # Landing page
│   ├── Scorecard.jsx   # Score tracking
│   └── WaitingRoom.jsx # Waiting for players
├── game/               # Game logic
│   └── yazyLogic.js    # Core game rules and scoring
├── supabase.js         # Supabase configuration
├── App.jsx             # Main app component
└── main.jsx           # Entry point
```

### Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Styling**: CSS3 with modern features
- **Deployment**: Vercel (frontend) + Supabase (backend)

### Adding Features

Some ideas for enhancements:

- **Chat System**: Add real-time chat during games
- **Game History**: Track wins/losses per player
- **Tournaments**: Multi-player bracket tournaments
- **Custom Rules**: Different Yazy variants
- **Animations**: Dice rolling animations
- **Sound Effects**: Audio feedback for actions

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJ0eXAiOiJKV1QiLCJhbGc...` |

## 🐛 Troubleshooting

### Common Issues

**"Game not found" error:**
- Check that your Supabase database is running
- Verify your environment variables are correct
- Make sure the games table was created properly

**Real-time updates not working:**
- Ensure Supabase real-time is enabled for your project
- Check browser console for WebSocket connection errors

**Deployment issues:**
- Make sure environment variables are set in your hosting platform
- Verify the build completes without errors locally first

### Getting Help

If you run into issues:

1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Test with a friend to confirm multiplayer functionality
4. Open an issue in this repository with details

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features  
- Submit pull requests
- Improve documentation

---

**Ready to play?** Follow the setup instructions above and challenge your friends to a game of Yazy! 🎯
