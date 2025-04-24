interface AnalyticsData {
  labels: string[];
  users: number[];
  rides: number[];
  events: number[];
  revenue: number[];
}

export async function exportAnalytics(timeFrame: string) {
  try {
    const response = await fetch(`/api/analytics/export?timeFrame=${timeFrame}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch analytics data');
    }

    const data: AnalyticsData = await response.json();
    
    // Create CSV content
    const headers = ['Date', 'Users', 'Rides', 'Events', 'Revenue'];
    const rows = data.labels.map((label, index) => [
      label,
      data.users[index],
      data.rides[index],
      data.events[index],
      data.revenue[index]
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hopin-analytics-${timeFrame}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
}