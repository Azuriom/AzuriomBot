import type { Client, CommandInteraction, Interaction } from 'discord.js'

import { ChannelType, EmbedBuilder } from 'discord.js'
import commands from './commands'

interface EmbedContent {
  title: string
  message: string
  fields?: Array<{ name: string; value: string }>
}

interface Command {
  name: string
  description: string
  embed: { en: EmbedContent; fr: EmbedContent }
}

const frenchCategory = process.env.CATEGORY_FRENCH
const registeredCommands = Object.fromEntries(
  commands.map((command: Command) => [command.name, command]),
)

export function registerCommands(client: Client) {
  client.once('ready', async () => {
    if (client.application) {
      await client.application.commands.set(Object.values(registeredCommands))
    }
  })
}

export function handleInteraction(interaction: Interaction) {
  if (!interaction.isCommand()) {
    return
  }

  const command = registeredCommands[interaction.commandName]

  if (command) {
    try {
      return dispatchCommand(interaction, command)
    } catch (e) {
      console.error(e)
    }
  }
}

function dispatchCommand(interaction: CommandInteraction, command: Command) {
  const channel = interaction.channel
  const categoryId = channel?.type === ChannelType.GuildText ? channel.parentId : null
  const locale = categoryId === frenchCategory ? 'fr' : 'en'
  const embedContent = command.embed[locale]

  const embed = new EmbedBuilder()
    .setTitle(embedContent.title)
    .setDescription(embedContent.message)
    .setColor('#004de6')
    .setFooter({ text: 'Azuriom Discord Bot' })
    .setTimestamp(new Date())
    .addFields(embedContent.fields ?? [])

  return interaction.reply({ embeds: [embed] })
}
