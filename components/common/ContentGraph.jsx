import React from 'react';
import dynamic from 'next/dynamic';
import Colors from 'style-dictionary/build/color.tokens.js';

const MyResponsiveLine = dynamic(() => import('./Line'), {
  ssr: false,
});

const data = [
  {
    id: 'Lekki (Detached Duplex)',
    color: Colors.secondary[500],
    data: [
      {
        x: 'lowest price',
        y: 120,
      },
      {
        x: 'average price',
        y: 180,
      },
      {
        x: 'maximum price',
        y: 190,
      },
    ],
  },
  {
    id: 'Lekki (Flat)',
    color: Colors.secondary[500],
    data: [
      {
        x: 'lowest price',
        y: 30,
      },
      {
        x: 'average price',
        y: 80,
      },
      {
        x: 'maximum price',
        y: 350,
      },
    ],
  },
  {
    id: 'Maitama (Bungalow)',
    color: Colors.secondary[500],
    data: [
      {
        x: 'lowest price',
        y: 30,
      },
      {
        x: 'average price',
        y: 70,
      },
      {
        x: 'maximum price',
        y: 150,
      },
    ],
  },
  {
    id: 'Maitama (Semi Detached Duplex)',
    color: Colors.secondary[500],
    data: [
      {
        x: 'lowest price',
        y: 100,
      },
      {
        x: 'average price',
        y: 250,
      },
      {
        x: 'maximum price',
        y: 500,
      },
    ],
  },
  {
    id: 'Ikoyi (Detached Duplex)',
    color: Colors.secondary[500],
    data: [
      {
        x: 'lowest price',
        y: 120,
      },
      {
        x: 'average price',
        y: 180,
      },
      {
        x: 'maximum price',
        y: 900,
      },
    ],
  },
];

const ContentGraph = () => {
  return (
    <div className="widget col-sm-12 mb-4 mb-md-0">
      {/* card */}
      <div className="card h-100 position-relative">
        {/* card body */}
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-12" style={{ height: '500px' }}>
              <MyResponsiveLine data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGraph;
