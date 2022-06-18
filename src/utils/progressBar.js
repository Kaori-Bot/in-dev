function progressBar(value, maxValue, size=22) {
    const emoji = ['🔲','▬'];
    if (!value || !maxValue) return { default: `${emoji[0]}${emoji[1].repeat(size)}`, persentage: '0%' };
    const percentage = value / maxValue;
    const progress = Math.round(size * percentage); 
    const emptyProgress = size - progress;

    const progressText = emoji[1].repeat(progress);
    const emptyProgressText = emoji[1].repeat(emptyProgress);
    const progressPercentage = Math.round(percentage * 100) + "%";

    const progressLine = progressText + emoji[0] + emptyProgressText;
    return { default: progressLine, percentage: progressPercentage };
};

module.exports = progressBar;
