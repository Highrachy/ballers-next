import MyResponsivePie from '../common/PieChart';
import Colors from 'style-dictionary/build/color.tokens.js';
import { moneyFormatInNaira } from 'utils/helpers';

export const OverviewGraph = ({ data }) => {
  const emptyData = [
    {
      id: 'noTransactions',
      label: 'No Trasanctions Yet',
      value: 1000,
      color: Colors.primary[50],
    },
  ];

  const isAllZero = data.every((item) => item.value === 0);

  const graphData = isAllZero
    ? emptyData
    : data.filter((item) => item.value !== 0);

  const chartColors = graphData.map((item) => item.color);

  return (
    <div className="card h-100 position-relative">
      <div className="card-body">
        <header className="d-flex flex-wrap align-items-center mb-4">
          <h6 className="card-title me-2">Overview</h6>
        </header>
        <figure className="row align-items-center">
          <div className="col-12" style={{ height: '250px' }}>
            <MyResponsivePie
              data={graphData}
              colors={chartColors}
              isAllZero={isAllZero}
            />
          </div>
        </figure>
        <section className="row justify-content-between g-0">
          <div className="col-12">
            <div className="text-sm mt-3">
              {data.map((item) => (
                <div className="d-flex flex-between-center mb-1" key={item.id}>
                  <div className="d-flex align-items-center">
                    <span
                      className="dot"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />
                    <span className="fw-semi-bold">{item.label}</span>
                  </div>
                  <span>
                    {moneyFormatInNaira(
                      data.find((d) => d.id === item.id)?.value
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OverviewGraph;
