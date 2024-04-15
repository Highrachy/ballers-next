const { ALL_HOUSE_TYPES } = require('@/utils/constants');
import React from 'react';

const contentProperty = {
  Lekki: {
    state: 'Lagos',
    lga: 'Ibeju Lekki',
    district: 'Lekki',
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
  'Lekki Phase 1': {
    state: 'Lagos',
    lga: 'Ibeju Lekki',
    district: 'Lekki',
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
    lga: 'Abuja',
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
  Ikeja: {
    state: 'Lagos',
    lga: 'Ikeja',
    longitude: 3.3792,
    latitude: 6.5244,
    content: (
      <>
        <p>
          Ikeja is a vibrant and bustling area in Lagos, known for its
          commercial activities, diverse culture, and lively atmosphere. As the
          capital of Lagos State, Ikeja is a major economic hub and home to
          several corporate headquarters, government offices, and commercial
          centers. The area offers a wide range of amenities, including shopping
          malls, markets, restaurants, and entertainment venues. Ikeja is also
          known for its well-developed infrastructure, transportation network,
          and modern facilities, making it an attractive destination for both
          residents and businesses.
        </p>
      </>
    ),
    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 278_780_000,
        averagePrice: 288_000_000,
        maximumPrice: 350_000_000,
      },
      [ALL_HOUSE_TYPES['Flat']]: {
        minimumPrice: 150_000_000,
        averagePrice: 200_000_000,
        maximumPrice: 400_000_000,
      },
      [ALL_HOUSE_TYPES['Terraced Duplex']]: {
        minimumPrice: 200_000_000,
        averagePrice: 300_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
  Ikoyi: {
    state: 'Lagos',
    lga: 'Eti Osa',
    longitude: 3.3909,
    latitude: 6.4543,
    content: (
      <>
        <p>
          Lagos Island is the heart of Lagos, Nigeria&apos;s largest city and
          economic capital. It is a bustling metropolis with a rich history,
          vibrant culture, and diverse population. Lagos Island is known for its
          iconic landmarks, such as the National Museum, Tafawa Balewa Square,
          and Freedom Park. The area is also home to major commercial districts,
          including Marina and Broad Street, where you&apos;ll find banks,
          corporate offices, and trading activities. Lagos Island offers a wide
          range of amenities, including shopping malls, markets, restaurants,
          and entertainment venues, making it a dynamic and exciting place to
          live and work.
        </p>
      </>
    ),
    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 304_000_000,
        averagePrice: 1_000_000_000,
        maximumPrice: 85_000_000,
      },
      [ALL_HOUSE_TYPES['Terraced Duplex']]: {
        minimumPrice: 200_000_000,
        averagePrice: 400_000_000,
        maximumPrice: 600_000_000,
      },
    },
  },
  Maryland: {
    state: 'Lagos',
    lga: 'Ikeja',
    longitude: 3.3667,
    latitude: 6.5833,
    content: (
      <>
        <p>
          Maryland is a bustling neighborhood in Lagos, known for its commercial
          activities, vibrant culture, and diverse community. The area is home
          to several corporate offices, shopping malls, markets, and
          entertainment venues, making it a popular destination for both
          residents and visitors. Maryland offers a wide range of amenities,
          including restaurants, cafes, cinemas, and recreational facilities,
          catering to various interests and lifestyles. With its strategic
          location and modern infrastructure, Maryland provides easy access to
          other parts of Lagos and is a vibrant hub of activity day and night.
        </p>
      </>
    ),
    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 185_750_000,
        averagePrice: 4_000_000_000,
        maximumPrice: 40_000_000,
      },
      [ALL_HOUSE_TYPES['Flat']]: {
        minimumPrice: 100_000_000,
        averagePrice: 200_000_000,
        maximumPrice: 500_000_000,
      },
      [ALL_HOUSE_TYPES['Terraced Duplex']]: {
        minimumPrice: 120_000_000,
        averagePrice: 250_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
  Ogombo: {
    state: 'Lagos',
    lga: 'Eti Osa',
    district: 'Ajah',
    longitude: 3.5736,
    latitude: 6.4712,
    content: (
      <>
        <p>
          Ajah is a rapidly developing area in Lagos, known for its affordable
          housing options, vibrant markets, and growing commercial activities.
          Situated along the Lekki-Epe Expressway, Ajah offers easy access to
          other parts of Lagos and is a popular choice for young professionals
          and families looking for affordable accommodation. The area boasts
          several markets, shopping malls, and entertainment venues, providing
          residents with a wide range of amenities and recreational
          opportunities. With its strategic location and ongoing development,
          Ajah is expected to continue growing and evolving, making it an
          attractive destination for both investors and residents alike.
        </p>
      </>
    ),
    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 80_000_000,
        averagePrice: 400_000_000,
        maximumPrice: 1_700_000_000,
      },
      [ALL_HOUSE_TYPES['Flat']]: {
        minimumPrice: 70_000_000,
        averagePrice: 90_000_000,
        maximumPrice: 120_000_000,
      },
      [ALL_HOUSE_TYPES['Terraced Duplex']]: {
        minimumPrice: 70_000_000,
        averagePrice: 150_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
  Badore: {
    state: 'Lagos',
    lga: 'Eti Osa',
    district: 'Ajah',
    longitude: 3.5736,
    latitude: 6.4712,
    content: (
      <>
        <p>
          Ajah is a rapidly developing area in Lagos, known for its affordable
          housing options, vibrant markets, and growing commercial activities.
          Situated along the Lekki-Epe Expressway, Ajah offers easy access to
          other parts of Lagos and is a popular choice for young professionals
          and families looking for affordable accommodation. The area boasts
          several markets, shopping malls, and entertainment venues, providing
          residents with a wide range of amenities and recreational
          opportunities. With its strategic location and ongoing development,
          Ajah is expected to continue growing and evolving, making it an
          attractive destination for both investors and residents alike.
        </p>
      </>
    ),
    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 80_000_000,
        averagePrice: 400_000_000,
        maximumPrice: 1_700_000_000,
      },
      [ALL_HOUSE_TYPES['Flat']]: {
        minimumPrice: 50_000_000,
        averagePrice: 70_000_000,
        maximumPrice: 120_000_000,
      },
      [ALL_HOUSE_TYPES['Terraced Duplex']]: {
        minimumPrice: 70_000_000,
        averagePrice: 150_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
  Sangotedo: {
    state: 'Lagos',
    lga: 'Eti Osa',
    district: 'Ajah',
    longitude: 3.5736,
    latitude: 6.4712,
    content: (
      <>
        <p>
          Ajah is a rapidly developing area in Lagos, known for its affordable
          housing options, vibrant markets, and growing commercial activities.
          Situated along the Lekki-Epe Expressway, Ajah offers easy access to
          other parts of Lagos and is a popular choice for young professionals
          and families looking for affordable accommodation. The area boasts
          several markets, shopping malls, and entertainment venues, providing
          residents with a wide range of amenities and recreational
          opportunities. With its strategic location and ongoing development,
          Ajah is expected to continue growing and evolving, making it an
          attractive destination for both investors and residents alike.
        </p>
      </>
    ),
    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 80_000_000,
        averagePrice: 400_000_000,
        maximumPrice: 1_700_000_000,
      },
      [ALL_HOUSE_TYPES['Flat']]: {
        minimumPrice: 50_000_000,
        averagePrice: 70_000_000,
        maximumPrice: 120_000_000,
      },
      [ALL_HOUSE_TYPES['Terraced Duplex']]: {
        minimumPrice: 70_000_000,
        averagePrice: 150_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
  'Abraham Adesanya': {
    state: 'Lagos',
    lga: 'Eti Osa',
    district: 'Ajah',
    longitude: 3.5736,
    latitude: 6.4712,
    content: (
      <>
        <p>
          Ajah is a rapidly developing area in Lagos, known for its affordable
          housing options, vibrant markets, and growing commercial activities.
          Situated along the Lekki-Epe Expressway, Ajah offers easy access to
          other parts of Lagos and is a popular choice for young professionals
          and families looking for affordable accommodation. The area boasts
          several markets, shopping malls, and entertainment venues, providing
          residents with a wide range of amenities and recreational
          opportunities. With its strategic location and ongoing development,
          Ajah is expected to continue growing and evolving, making it an
          attractive destination for both investors and residents alike.
        </p>
      </>
    ),
    houseType: {
      [ALL_HOUSE_TYPES['Detached Duplex']]: {
        minimumPrice: 80_000_000,
        averagePrice: 400_000_000,
        maximumPrice: 1_700_000_000,
      },
      [ALL_HOUSE_TYPES['Flat']]: {
        minimumPrice: 50_000_000,
        averagePrice: 70_000_000,
        maximumPrice: 120_000_000,
      },
      [ALL_HOUSE_TYPES['Terraced Duplex']]: {
        minimumPrice: 70_000_000,
        averagePrice: 150_000_000,
        maximumPrice: 500_000_000,
      },
    },
  },
};

// Color palette for different house types
const colorPalette = {
  [ALL_HOUSE_TYPES['Detached Duplex']]: 'hsl(286, 70%, 50%)',
  [ALL_HOUSE_TYPES['Flat']]: 'hsl(168, 70%, 50%)',
  [ALL_HOUSE_TYPES['Bungalow']]: 'hsl(184, 70%, 50%)',
  [ALL_HOUSE_TYPES['Semi-detached Duplex']]: 'hsl(350, 70%, 50%)',
  [ALL_HOUSE_TYPES['Penthouse']]: 'hsl(99, 70%, 50%)',
};

// Function to generate data for a particular state
export const generateChartDataForState = (state) => {
  const stateData = contentProperty[state];
  if (!stateData) return [];

  const chartData = Object.entries(stateData.houseType).map(
    ([houseType, prices]) => ({
      id: houseType,
      color: colorPalette[houseType],
      data: [
        {
          x: houseType,
          y: prices.averagePrice, // You can use minimumPrice, averagePrice, or maximumPrice here
        },
      ],
    })
  );

  return chartData;
};

export default contentProperty;
