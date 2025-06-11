function calculateWeightedAverage(gradesArray) {
  let totalWeightedSum = 0;
  let totalWeight = 0;

  for (let i = 0; i < gradesArray.length; i++) {
    const [grade, weight] = gradesArray[i];
    totalWeightedSum += grade * weight;
    totalWeight += weight;
  }

  // Handle the case where no weights have been entered yet
  if (totalWeight === 0) {
    return 0;
  }

  // Calculate and return the weighted average
  return totalWeightedSum / totalWeight;
}

module.exports = {calculateWeightedAverage}
