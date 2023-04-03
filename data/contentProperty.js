const { ALL_HOUSE_TYPES } = require('@/utils/constants');
import React from 'react';

const contentProperty = {
  Lekki: {
    state: 'Lagos',
    longitude: 3.5852,
    latitude: 6.4698,

    content: (
      <>
        <p>
          Lekki is a prestigious neighborhood in Lagos, known for its high-end
          residences, luxurious amenities, and beautiful waterfront location.
          Formerly a slum called Maroko, Lekki has since been refurbished and
          renamed, and now serves as a residential and business hub. Lekki is
          surrounded by water, making it a natural peninsula situated to the
          east of Lagos City, with Ikoyi and Victoria Island to the west. While
          Lekki is still under development, the completed Lekki Phase 1 is a
          major part of the project.
        </p>
        <p>
          Lekki is a highly sought-after place to live and offers a work-play
          lifestyle with attractive leisure spots and fine dining
          establishments. It is also a popular shopping destination and a hub of
          entertainment activity on weekends. Lekki boasts some of the top
          schools in Nigeria, as well as numerous worship centers.
        </p>
      </>
    ),

    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 120_000_000,
        averagePrice: 180_000_000,
        maximumPrice: 900_000_000,
      },

      [ALL_HOUSE_TYPES['Flat']]: {
        minimumPrice: 10_000_000,
        averagePrice: 30_000_000,
        maximumPrice: 50_000_000,
      },
    },
  },
  Maitama: {
    state: 'Abuja',
    longitude: 5.11,
    latitude: 5.11,

    houseType: {
      [ALL_HOUSE_TYPES['Bungalow']]: {
        minimumPrice: 10_000_000,
        averagePrice: 30_000_000,
        maximumPrice: 50_000_000,
      },

      [ALL_HOUSE_TYPES['Penthouse']]: {
        minimumPrice: 100_000_000,
        averagePrice: 150_000_000,
        maximumPrice: 500_000_000,
      },

      [ALL_HOUSE_TYPES['Semi-detached Duplex']]: {
        minimumPrice: 10_000_000,
        averagePrice: 30_000_000,
        maximumPrice: 50_000_000,
      },
    },
  },
  'Victoria Island': {
    state: 'Abuja',
    longitude: 5.11,
    latitude: 5.11,

    houseType: {
      [ALL_HOUSE_TYPES['Bungalow']]: {
        minimumPrice: 10_000_000,
        averagePrice: 30_000_000,
        maximumPrice: 50_000_000,
      },

      [ALL_HOUSE_TYPES['Penthouse']]: {
        minimumPrice: 10_000_000,
        averagePrice: 30_000_000,
        maximumPrice: 50_000_000,
      },

      [ALL_HOUSE_TYPES['Semi-detached Duplex']]: {
        minimumPrice: 10_000_000,
        averagePrice: 30_000_000,
        maximumPrice: 50_000_000,
      },
    },
  },
};

export default contentProperty;
