export interface AnalyticsData {
  users: number[];
  rides: number[];
  events: number[];
  revenue: number[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      mode: 'index' | 'nearest' | 'point';
      intersect: boolean;
    };
  };
}