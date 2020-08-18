import { Message } from 'discord.js';
import prettyMs from 'pretty-ms';
import { database } from '../utils/databaseFunctions';
import { embed } from '../utils/embed';

export const run = async (message: Message): Promise<Message | void> => {
    const cooldown = 8.64e7;
    const streakResetTime = 1.728e8;

    const lastDaily = await database.getProp('cooldown', message.author.id, 'daily');
    const time = prettyMs(cooldown - (Date.now() - lastDaily), { secondsDecimalDigits: 0, verbose: true });

    const dailyEmbed = embed({
        author: {
            image: message.author.displayAvatarURL(),
            name: message.author.username,
        },
        color: message.guild?.me?.displayHexColor,
    });

    if (cooldown - (Date.now() - lastDaily) > 0) {
        dailyEmbed.setDescription(`You collected your daily reward already! Come back in ${time}!`);
    } else if (cooldown - (Date.now() - lastDaily) <= 0) {
        const streak = (await database.getProp('economy', message.author.id, 'streak')) || 0;

        if (lastDaily && streakResetTime - (Date.now() - lastDaily) <= 0) {
            await database.addProp('economy', message.author.id, 250, 'balance');
            await database.setProp('economy', message.author.id, 1, 'streak');
            await database.setProp('cooldown', message.author.id, Date.now(), 'daily');

            dailyEmbed.setDescription(`You collected your daily bonus of **$250** (Streak: **1**) You didn't collect your bonus for 2 days so your streak has been reset`);
        } else {
            const money = 250 + streak * 10;

            await database.addProp('economy', message.author.id, money, 'balance');
            await database.addProp('economy', message.author.id, 1, 'streak');
            await database.setProp('cooldown', message.author.id, Date.now(), 'daily');

            dailyEmbed.setDescription(`You collected your daily bonus of **$${money}** (Streak: **${streak + 1}**)`);
        }
    }
    message.channel.send(dailyEmbed);
};

export const help = {
    aliases: ['daily'],
    name: 'Daily',
    description: 'Collect daily reward',
    usage: 'daily',
    example: 'daily',
};

export const config = {
    args: 0,
    owner: false,
};