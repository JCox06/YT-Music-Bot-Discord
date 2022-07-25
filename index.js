const { Client, Intents, Collection } = require("discord.js");
const { token } = require("./config");
const { info, error, warn } = require("./logging");

const fs = require("node:fs");

const lockMode = false;

warn("Please ensure that you have deployed commands before running");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });


client.once("ready", () => {
  info("Success! Application is ready");
  if (lockMode) {
    warn("LOCKMODE has been enabled");
    client.user.setActivity('COMMANDS BLOCKED', { type: "LISTENING" });
  } else {
    client.user.setActivity('for "/"', { type: "LISTENING" });
  }
});

client.login(token);

info("Success! Logged into Discord");

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  info(`Registering command ${file}`);
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {

    if (lockMode) {
      warn("Command was blocked due to server being in lock mode");
      await interaction.reply({content: "Server Error!", ephemeral: false});
    } else {
      info(`Executing command: ${command.name}`);
      await command.execute(interaction);
    }

  } catch (e) {
    error(`Command could not complete: ${e}`);
    await interaction.reply({ content: "Server Error!", ephemeral: true });
  }

});

module.exports = client;