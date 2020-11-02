import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	aliases: ['h'],
	description: 'Gives you a list of commands',
	detailedDescription: 'You may also provide a command, which will return info about that command',
	preconditions: []
})
export default class Help extends Command {
	public async run(message: Message, args: Args) {
		const command = await args.pickResult('string');
		if (command.success) return this.commandHelp(message, command.value);
		return message.channel.send(this.mapCommandsToStr());
	}

	private async commandHelp(message: Message, cmd: string) {
		const command = this.client.commands.get(cmd);
		if (typeof command === 'undefined') return message.channel.send("Couldn't find that command!");
		return message.channel.send(
			new MessageEmbed()
				.setColor(0x1100ff)
				.setTitle(command.name)
				.setDescription(`${command.description}`)
				.addField('\u200B', '\u200B')
				.addField('In detail:', command.detailedDescription)
		);
	}

	private mapCommandsToStr() {
		return this.client.commands.map((val) => `${val.name} → ${val.description}`).join('\n');
	}
}
