export class StartEndDate {
    startDate: string;
    endDate: string;
}


// FORMAT: YYYY-MM-DD
export function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

// Get started and end date based on DateRangeType
export function getDateRange(): StartEndDate {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const result = new StartEndDate();
    result.startDate = formatDate(oneMonthAgo);
    result.endDate = formatDate(today);

    return result;
}