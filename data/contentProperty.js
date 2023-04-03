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
        minimumPrice: 30_000_000,
        averagePrice: 80_000_000,
        maximumPrice: 350_000_000,
      },
    },
  },
  Maitama: {
    state: 'Abuja',
    longitude: 7.4934,
    latitude: 9.0882,

    content: (
      <>
        <p>
          Maitama is an upscale neighborhood located in the central district of
          Abuja, Nigeria&apos;s capital city. The area is known for its
          exclusivity and luxuriousness, with some of the most expensive homes
          and real estate properties in the city. The residents of Maitama are
          mostly high-class individuals, including business tycoons,
          politicians, and diplomats. The neighborhood boasts excellent road
          networks, good electricity supply, and top-notch security, with little
          to no records of crime rate. Maitama is home to numerous amenities,
          such as markets, companies, schools, worship centers, and fun spots.
          Popular schools in Maitama include the Regent School Abuja, Hillcrest
          School Abuja, and the American International School Abuja. The
          neighborhood also boasts notable worship centers such as the Maitama
          Mosque, All Saints Anglican Church, and the ECWA Church. Fun spots in
          Maitama include the Transcorp Hilton Hotel, Capital Hub, and
          Millennium Park, among others. Prominent hospitals in the area include
          the National Hospital Abuja and the Kelina Hospital.
        </p>
      </>
    ),

    houseType: {
      [ALL_HOUSE_TYPES['Bungalow']]: {
        minimumPrice: 30_000_000,
        averagePrice: 70_000_000,
        maximumPrice: 150_000_000,
      },

      [ALL_HOUSE_TYPES['Semi-detached Duplex']]: {
        minimumPrice: 100_000_000,
        averagePrice: 250_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
  Ikoyi: {
    state: 'Lagos',
    longitude: 3.4333,
    latitude: 6.45,

    content: (
      <>
        Ikoyi is a luxurious and exclusive neighborhood in Lagos, considered the
        most expensive in the city, with high-class residents such as business
        moguls, politicians, and celebrities. The area boasts well-channels
        roads, good electricity supply, and top-notch security, contributing to
        its peaceful atmosphere. Amenities include markets, companies, schools,
        worship centers, and fun spots such as Casa Lydia, Golden Gate
        Restaurant, and Avalon Lounge, and prominent hospitals such as GCH
        Bourdillon and Atlantic Medical Centre.
      </>
    ),

    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 120_000_000,
        averagePrice: 180_000_000,
        maximumPrice: 900_000_000,
      },

      [ALL_HOUSE_TYPES['Penthouse']]: {
        minimumPrice: 150_000_000,
        averagePrice: 300_000_000,
        maximumPrice: 800_000_000,
      },

      [ALL_HOUSE_TYPES['Semi-detached Duplex']]: {
        minimumPrice: 150_000_000,
        averagePrice: 300_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
};

export default contentProperty;
