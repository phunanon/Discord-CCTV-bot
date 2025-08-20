# Discord CCTV bot

Just like fake CCTV cameras in real life, this bot simply joins the highest positioned voice channel when anybody else does and sits there *looking* like it's recording, but it's not.

## Hosting

Instructions for Node.js, in the terminal:

```bash
pnpm add -g pm2                    # Keeps the bot running even if it crashes
pnpm i                             # Installs exact dependencies
pm2 start out/index.js --name CCTV # Starts up the bot
```
