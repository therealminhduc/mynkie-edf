export function calculateCostPerDay(kWh: number): number {
    const pricePerKWh = 0.1906;
    const priceSubscription = 0.50;
    return pricePerKWh * kWh + priceSubscription;
}

export function getSubscriptionPrice() {
    return 0.50;
}