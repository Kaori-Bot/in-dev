function progressBar(player, size=22) {
	const line = "▬";
	const slider = "🔲";
	if (!player || !player.queue.current) return `${slider}${line.repeat(size - 1)}]`;
	const current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
	const total = player.queue.current.duration;
	let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];
	if (!String(bar).includes(slider)) return `${slider}${line.repeat(size - 1)}`;
	return { default: bar[0], time: bar[1] };
};

module.exports = progressBar;
