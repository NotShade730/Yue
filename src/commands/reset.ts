import { Client, Message } from 'discord.js';
import { database } from '../utils/databaseFunctions';
import { embed } from '../utils/embed';
import { emojis } from '../utils/emojis';
import { utils } from '../utils/utils';

export const run = async (message: Message, client: Client, args: string[]): Promise<Message | void> => {
    const user = await utils.getUser(args.join(' '), client);
    const resetEmbed = embed({
        author: {
            image: message.author.displayAvatarURL(),
            name: message.author.username,
        },
        color: message.guild?.me?.displayHexColor,
    });

    if (!user) return message.channel.send(resetEmbed.setDescription(`${emojis.tickNo} I couldn't find that user!`));
    if (user.bot) return message.channel.send(resetEmbed.setDescription(`${emojis.tickNo} You can't reset bots!`));

    await database.delete('economy', user.id);

    resetEmbed.setAuthor(user.username, user.displayAvatarURL());
    message.channel.send(resetEmbed.setDescription(`${emojis.tickYes} **${user.tag}**'s stats has been reset successfully`));
};

export const help = {
    aliases: ['reset'],
    name: 'Reset',
    description: "Reset someone's stats",
    usage: 'reset <user>',
    example: 'reset @Conor#0751',
};

export const config = {
    args: 0,
};
