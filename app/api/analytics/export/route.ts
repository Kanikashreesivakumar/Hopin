import { NextResponse } from 'next/server';

// Sample analytics data - replace with your actual data fetching logic
const getAnalyticsData = async (timeFrame: string) => {
  const now = new Date();
  const labels = [];
  const data: { users: number[]; rides: number[]; events: number[]; revenue: number[] } = {
    users: [],
    rides: [],
    events: [],
    revenue: []
  };

  // Generate last 12 months of data
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(date.toLocaleString('default', { month: 'short' }));
    
    // Generate sample data - replace with real data
    data.users.push(Math.floor(Math.random() * 1000) + 500);
    data.rides.push(Math.floor(Math.random() * 500) + 200);
    data.events.push(Math.floor(Math.random() * 100) + 50);
    data.revenue.push(Math.floor(Math.random() * 10000) + 5000);
  }

  return { labels, ...data };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get('timeFrame') || 'year';

    const analyticsData = await getAnalyticsData(timeFrame);

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics export error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}