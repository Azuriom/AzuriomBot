import { Client, GatewayIntentBits } from 'discord.js'
import { handleInteraction, registerCommands } from './commands/command_manager'

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

export async function start() {
  const token = process.env.DISCORD_TOKEN

  if (!token) {
    console.error('You must provide a Discord token as the DISCORD_TOKEN environment variable.')
    process.exit(1)
  }

  registerCommands(client)

  await client.login(token)

  client.on('interactionCreate', handleInteraction)
  client.user?.setActivity('https://azuriom.com')

  console.log(`Logged in as ${client.user?.tag}.`)
  process.on('exit', () => client.destroy())
}

start()
