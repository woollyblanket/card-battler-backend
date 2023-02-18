// https://trekhleb.medium.com/weighted-random-in-javascript-4748ab3a1500
export const weightedRandom = (items, weights) => {
	try {
		if (items.length !== weights.length) {
			throw new Error("Items and weights must be of the same size");
		}

		if (!items.length) {
			throw new Error("Items must not be empty");
		}

		const cumulativeWeights = [];
		for (let i = 0; i < weights.length; i++) {
			cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
		}

		const maxCumulativeWeight =
			cumulativeWeights[cumulativeWeights.length - 1];
		const randomNumber = maxCumulativeWeight * Math.random();

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			if (cumulativeWeights[itemIndex] >= randomNumber) {
				return {
					item: items[itemIndex],
					index: itemIndex,
				};
			}
		}
	} catch (error) {
		return error;
	}
};
