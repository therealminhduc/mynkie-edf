export function calculateCostPerDay(kWh: number): number {
    const pricePerKWh = 0.1906;
    return pricePerKWh * kWh;
}
