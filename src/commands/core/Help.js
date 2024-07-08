import BaseCommand from '../../libs/BaseCommand.js';

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'help',
            aliases: ['menu', 'h'],
            category: 'core',  // Updated category
            description: {
                content: 'Displays the menu',
                usage: '[command]'
            },
            dm: false,
            exp: 1
        });
    }

    exec = async (M, parsedArgs) => {
        if (!parsedArgs.text) {
            const commands = this.handler.commands.keys();
            const categories = {};
            for (const command of commands) {
                const info = this.handler.commands.get(command);
                if (!command) continue;
                if (Object.keys(categories).includes(info.config.category)) categories[info.config.category].push(info);
                else {
                    categories[info.config.category] = [];
                    categories[info.config.category].push(info);
                }
            }
            let text = `╭─「 (づ￣ ³￣)づ 」*\n*│ ɴᴀᴍᴇ:* ${this.replaceWithCustomAlphabet(this.client.config.name)}\n*│ ᴜsᴇʀ: @⁨${this.replaceWithCustomAlphabet(M.sender.username)}*\n*│ ᴘʀᴇғɪx:* [ ${this.client.config.prefix} ]\n*│ ᴏᴡɴᴇʀ:* *${this.client.util.capitalize(this.replaceWithCustomAlphabet('𝐉𝐅𝐋𝐄𝐗 𝐎𝐆 {}'))}*\n*╰────────────┈平和* \n\n📚 *Below are my available commands*:\n\n`;
            const keys = Object.keys(categories);
            const categoryEmojis = this.getCategoryEmojis();

            for (const key of keys) {
                text += `*${this.replaceWithCustomAlphabet(key.replace('undefined ', ''))} ${categoryEmojis[key]} :-*\n`;
                text += `➮\`\`\`${categories[key].map(command => command.config.command).join(' , ')}\`\`\`\n\n`;
            }

            // Adding evil emoji reaction
            await M.react('😈');

            text += `🗒️ *Note:* To summon more information about a command, use ${this.client.config.prefix}help <cmd_name>. Example: *${this.client.config.prefix}help info*\n\n*> ©️ OBANAI-BOT.Inc*`;

            return void (await M.reply(text));
        }
        const key = parsedArgs.text.toLowerCase();
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key);
        if (!command) return void (await M.reply(`❌ No Command or Alias Found *"${key}"*`));

        // Get the command's status and cooldown
        const cmdStatus = (await this.client.DB.command.get(command.config?.command)) ?? {
            isDisabled: false,
            reason: ''
        };
        const cmdCooldown = command.config.cooldown ? `${command.config.cooldown} seconds` : 'None';

        // Construct the details message
        const detailsMessage = `☠ *Command:* ${this.replaceWithCustomAlphabet(command.config.command)}
🎴 *Aliases:* ${command.config.aliases ? command.config.aliases.join(', ').trim() : 'None'}
🔗 *Category:* ${this.replaceWithCustomAlphabet(command.config.category)}
⏰ *Cooldown:* ${cmdCooldown}
🎗 *Usage:* ${this.client.config.prefix}${command.config.command} ${command.config.description.usage ?? ''}
🧧 *Description:* ${this.replaceWithCustomAlphabet(command.config.description?.content)}`;

        return void (await M.reply(detailsMessage));
    }

    getCategoryEmojis = () => {
        return {
            'core': '⚙️',
            'fun': '🎭',
            'game': '🎮',
            'media': '🎵',
            'moderation': '🔨',
            'search': '🔍',
            'utils': '🔧',
            'weeb': '👾',
            'cards': '🃏',
            'economy': '💰',  // Added economy emoji
            'dev': '🕵🏽‍♂️' // Added dev emoji
        };
    }

    replaceWithCustomAlphabet = (sentence) => {
        const customAlphabetMap = {
            a: 'ᴀ',
            b: 'ʙ',
            c: 'ᴄ',
            d: 'ᴅ',
            e: 'ᴇ',
            f: 'ꜰ',
            g: 'ɢ',
            h: 'ʜ',
            i: 'ɪ',
            j: 'ᴊ',
            k: 'ᴋ',
            l: 'ʟ',
            m: 'ᴍ',
            n: 'ɴ',
            o: 'ᴏ',
            p: 'ᴘ',
            q: 'φ',
            r: 'ʀ',
            s: 'ꜱ',
            t: 'ᴛ',
            u: 'ᴜ',
            v: 'ᴠ',
            w: 'ᴡ',
            x: 'x',
            y: 'ʏ',
            z: 'ᴢ'
        };
        const words = sentence.split(' ');
        const replacedWords = words.map((word) => {
            const letters = word.split('');
            const replacedLetters = letters.map((letter) => {
                const lowercaseLetter = letter.toLowerCase();
                return customAlphabetMap[lowercaseLetter] || letter;
            });
            return replacedLetters.join('');
        });
        return replacedWords.join(' ');
    }
                }
