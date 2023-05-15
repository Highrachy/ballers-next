// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/pie
import { ResponsivePie } from '@nivo/pie';
import Humanize from 'humanize-plus';
import { moneyFormatInNaira } from '@/utils/helpers';
import useWindowSize from '@/hooks/useWindowSize';
import { MOBILE_WIDTH } from '@/utils/constants';
import Colors from 'style-dictionary/build/color.tokens.js';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsivePie = ({ data, isAllZero, colors /* see data tab */ }) => {
  const WINDOW_SIZE = useWindowSize();
  const isMobileDevice = WINDOW_SIZE.width <= MOBILE_WIDTH;
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 20, right: 80, bottom: 40, left: 80 }}
      startAngle={-150}
      endAngle={150}
      innerRadius={0.6}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]],
      }}
      arcLabel={function (e) {
        console.log('e', e);
        return e.id;
      }}
      arcLinkLabel={function (e) {
        const word = Humanize.capitalize(e.id);
        return Humanize.truncate(word, isMobileDevice ? 10 : 20);
        // return `${Humanize.capitalize(e.id)}`;
        // return Humanize.intword(e.value, 'this is a nop', 0);
      }}
      arcLinkLabelsSkipAngle={0}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLinkLabelsDiagonalLength={18}
      arcLinkLabelsStraightLength={7}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      colors={isAllZero ? [Colors.primary[50]] : colors}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: 'rgba(255, 255, 255, 0.3)',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      enableArcLabels={false}
      enableArcLinkLabels={!isAllZero}
      // fill={[
      //   {
      //     match: {
      //       id: 'transactions',
      //     },
      //     id: 'lines',
      //   },
      //   {
      //     match: {
      //       id: 'contribution',
      //     },
      //     id: 'dots',
      //   },
      // ]}
      // legends={[
      //   {
      //     anchor: 'bottom',
      //     direction: 'row',
      //     justify: false,
      //     translateX: 0,
      //     translateY: 56,
      //     itemsSpacing: 0,
      //     itemWidth: 100,
      //     itemHeight: 18,
      //     itemTextColor: '#999',
      //     itemDirection: 'left-to-right',
      //     itemOpacity: 1,
      //     symbolSize: 18,
      //     symbolShape: 'circle',
      //     effects: [
      //       {
      //         on: 'hover',
      //         style: {
      //           itemTextColor: '#000',
      //         },
      //       },
      //     ],
      //   },
      // ]}
      legends={[]}
      tooltip={function (e) {
        var t = e.datum;
        return (
          <div
            style={{
              background: 'white',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '3px',
            }}
          >
            {Humanize.capitalize(t.id)} - {moneyFormatInNaira(t.value)}
          </div>
        );
      }}
    />
  );
};

export default MyResponsivePie;

// const hover = {
//   id: 'transactions',
//   label: 'Trasanctions',
//   hidden: false,
//   value: 5000000,
//   formattedValue: '5000000',
//   data: {
//     id: 'transactions',
//     label: 'Trasanctions',
//     value: 5000000,
//   },
//   color: '#5775fa',
//   arc: {
//     index: 0,
//     startAngle: -2.6179938779914944,
//     endAngle: 0.2895307303586149,
//     innerRadius: 57.8770255651225,
//     outerRadius: 104.46170927520417,
//     thickness: 38.58468371008167,
//     padAngle: 0.012217304763960306,
//     angle: 2.9075246083501094,
//     angleDeg: 166.5888888888889,
//   },
//   fill: 'url(#lines.bg.#5775fa)',
// };
