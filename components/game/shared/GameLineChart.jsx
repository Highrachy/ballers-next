// components/GameLineChart.js
import { ResponsiveLine } from '@nivo/line';
import { Spinner } from 'react-bootstrap';

/* Bright, colour-blind-safe palette */
const COLORS = ['#FF6361', '#58508D', '#FFA600']; // (total / answers / result)

export default function GameLineChart({ chartData, isLoading, isError }) {
  if (isLoading)
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );

  if (isError)
    return (
      <div className="alert alert-danger my-4" role="alert">
        Failed to load stats. Please try again.
      </div>
    );

  return (
    <div style={{ height: 480 }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 70, right: 40, bottom: 90, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, stacked: false, nice: true }}
        axisBottom={{
          tickRotation: -45,
          legend: 'Date',
          legendOffset: 60,
          legendPosition: 'middle',
        }}
        axisLeft={{
          legend: 'Number of Entries',
          legendOffset: -50,
          legendPosition: 'middle',
        }}
        theme={{
          fontSize: 12,
          tooltip: {
            container: {
              background: '#ffffff',
              border: '1px solid #dee2e6',
              color: '#212529',
              borderRadius: 4,
              padding: '6px 9px',
            },
          },
          axis: {
            ticks: {
              text: { fill: '#495057' },
            },
          },
        }}
        colors={COLORS}
        lineWidth={3}
        pointSize={8}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointColor="#ffffff"
        curve="monotoneX"
        enableGridY
        tooltip={(point) => (
          <div>
            <strong>{point.point.data.xFormatted}</strong>
            <br />
            {point.point.serieId}: <b>{point.point.data.yFormatted}</b>
          </div>
        )}
        useMesh
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 80,
            justify: false,
            itemWidth: 140,
            itemHeight: 18,
            itemsSpacing: 12,
            symbolSize: 14,
            symbolShape: 'circle',
            itemTextColor: '#212529',
          },
        ]}
      />
      {/* Inline title & description overlay */}
      <div style={{ position: 'absolute', top: 16, left: 20 }}>
        <h5 className="fw-bold mb-1">Daily Game-Entry Activity</h5>
        <small className="text-muted">
          Tracking overall submissions, answers provided &amp; completed results
        </small>
      </div>
    </div>
  );
}
