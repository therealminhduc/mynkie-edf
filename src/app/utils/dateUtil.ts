export class StartEndDate {
    startDate: string;
    endDate: string;

    constructor(startDate: string, endDate: string) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
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

    const result = new StartEndDate(
        formatDate(oneMonthAgo),
        formatDate(today)
    );

    return result;
}