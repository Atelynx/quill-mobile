export interface AmountEstimate {
  quantity: number;
  estimatedCost: number;
  enoughForOne: boolean;
}

export const estimateQuantityFromAmount = (amountInput: unknown, referencePrice: number): AmountEstimate => {
  const amount = Number(amountInput);
  if (!Number.isFinite(amount) || !Number.isFinite(referencePrice) || referencePrice <= 0) {
    return { quantity: 0, estimatedCost: 0, enoughForOne: false };
  }

  const quantity = Math.floor(amount / referencePrice);
  return {
    quantity,
    estimatedCost: quantity * referencePrice,
    enoughForOne: quantity >= 1,
  };
};
