// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import contentProperty from '@/data/contentProperty';
import { ResponsiveLine } from '@nivo/line';
import colorTokens from 'style-dictionary/build/color.tokens';

const formatYAxis = (value) => {
  if (Math.abs(value) >= 1e9) {
    return `${value / 1e9} billion`;
  } else if (Math.abs(value) >= 1e6) {
    return `${value / 1e6} million`;
  } else {
    return value;
  }
}; // Custom formatting function

const CustomSliceTooltip = ({ slice }) => {
  console.log('slice', slice);
  return (
    <div className="bg-white border rounded p-3">
      <div className="mb-3">
        <strong>{slice.points[0]?.data.x}</strong>
      </div>
      {slice.points.map((point) => (
        <div key={point.id} className="d-flex align-items-center mb-2">
          <span
            className="d-inline-block rounded-circle me-2"
            style={{
              backgroundColor: point.serieColor,
              height: '10px',
              width: '10px',
            }}
          />
          <strong className="me-2">{point.serieId}:</strong>
          <span>{formatYAxis(point.data.y)}</span>
        </div>
      ))}
    </div>
  );
};

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveLine = ({
  data,
  /* see data tab */
}) => (
  <ResponsiveLine
    animate
    axisLeft={{
      format: formatYAxis,
      tickValues: 5,
    }}
    colors={[
      colorTokens.secondary[500],
      colorTokens.pink[500],
      colorTokens.purple[500],
      colorTokens.warning[500],
      colorTokens.danger[500],
    ]}
    curve="monotoneX"
    crosshairType="cross"
    data={data}
    enableArea
    enableSlices="x"
    enableTouchCrosshair
    height={400}
    legends={[
      {
        anchor: 'top',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: -20,
        itemWidth: 78,
        itemHeight: 20,
        itemsSpacing: 4,
        symbolSize: 10,
        symbolShape: 'circle',
        itemDirection: 'left-to-right',
        itemTextColor: '#777',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    lineWidth={3}
    margin={{
      bottom: 60,
      left: 80,
      right: 20,
      top: 20,
    }}
    markers={[
      {
        axis: 'y',
        legend: 'y marker at 0',
        legendPosition: 'top-left',
        lineStyle: {
          stroke: colorTokens.primary[100], // Change marker line color
          strokeWidth: 1,
          strokeDasharray: '5, 5', // Dotted line style
        },
        value: 230_000_000,
      },
    ]}
    pointBorderColor={{
      from: 'serieColor',
    }}
    pointBorderWidth={2}
    pointColor="#ffffff"
    pointSize={12}
    sliceTooltip={CustomSliceTooltip}
    theme={{
      crosshair: {
        line: {
          stroke: colorTokens.primary[500],
          strokeOpacity: 0.5,
          strokeWidth: 2,
        },
      },
    }}
    width={900}
    xScale={{ type: 'point' }}
    yFormat={formatYAxis}
    yScale={{
      stacked: true,
      type: 'linear',
      stacked: true,
      reverse: false,
    }}
  />
);

export const generateLineChartData = (stateName) => {
  const stateData = contentProperty[stateName];

  if (!stateData) {
    // Return empty array or handle error if state data is not found
    return [];
  }

  const houseTypes = Object.keys(stateData.houseType);

  const lineChartData = houseTypes.map((houseType, index) => {
    const { minimumPrice, averagePrice, maximumPrice } =
      stateData.houseType[houseType];

    return {
      id: houseType,
      data: [
        { x: 'Min', y: minimumPrice },
        { x: 'Average', y: averagePrice },
        { x: 'Max', y: maximumPrice },
      ],
    };
  });

  return lineChartData;
};

export default MyResponsiveLine;
