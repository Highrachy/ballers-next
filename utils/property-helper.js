import {
  getLocationFromAddress,
  moneyFormatInNaira,
  getAutoCompleteAsString,
} from './helpers';

const getRandomElementFromArray = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const generateArticle = (word) => {
  // Remove leading and trailing spaces, and convert to lowercase for consistency
  word = word.trim().toLowerCase();

  // Check if the word starts with a vowel
  const startsWithVowel = ['a', 'e', 'i', 'o', 'u'].includes(word[0]);

  // Return 'an' if it starts with a vowel, otherwise return 'a'
  const article = startsWithVowel ? 'an' : 'a';
  return article + ' ' + word;
};

const generateRandomFeatureDescription = () => {
  const featureDescriptions = [
    'top-quality amenities',
    'modern facilities',
    'luxury throughout',
    'state-of-the-art comforts',
    'sophisticated touches',
    'exclusive extras',
    'first-class features',
    'modern conveniences',
    'premium offerings',
    'a range of comforts',
    'world-class services',
    'meticulous craftsmanship',
    'opulent living spaces',
    'elegant finishing touches',
    'ultimate convenience',
    'luxurious details',
    'unparalleled luxury',
    'innovative amenities',
    'sophisticated technology',
    'exquisite interiors',
    'premium lifestyle',
  ];
  return getRandomElementFromArray(featureDescriptions);
};

const generateRandomEndingStatement = () => {
  const endingStatements = [
    'Discover the opportunity to make this exceptional property your new home!',
    'See the potential of this unique property; it could be your new home!',
    'Embrace the chance to call this outstanding property your new place!',
    'Enjoy the opportunity to make this incredible property yours!',
    "Don't miss the opportunity to make this amazing property your own!",
    'Explore the possibilities of owning this exceptional property!',
    "Imagine your life in this remarkable property; it's waiting for you!",
    'Take the first step towards calling this distinctive property your own!',
    'Find your dream home in this extraordinary property!',
    'Make your dreams a reality with this exceptional property!',
    'Your new home is just a step away in this incredible property!',
    'Create lasting memories in this unique and inviting property!',
  ];
  return getRandomElementFromArray(endingStatements);
};

const generateRandomMiddleStatement = (bedroomDescriptions) => {
  const middleStatements = [
    `Step inside this property, and you'll find ${generateArticle(
      bedroomDescriptions
    )} and toilets. The living room offers comfort and relaxation, and a spacious dining area is perfect for gatherings.`,
    `Inside, there are ${bedroomDescriptions} and toilets. The living room is designed for your comfort and relaxation, and a spacious dining area is an excellent place for get-togethers.`,
    `Step into this property and discover the ${bedroomDescriptions} and toilets. The living room is your haven for comfort and relaxation, and a spacious dining area is the ideal setting for gatherings.`,
    `As you enter this property, you'll find ${generateArticle(
      bedroomDescriptions
    )} and toilets. The living room provides a cozy atmosphere, and a spacious dining area is perfect for social gatherings.`,
    `Inside this property, you'll discover ${generateArticle(
      bedroomDescriptions
    )} and toilets. The living room is your sanctuary for relaxation, and the spacious dining area is perfect for hosting guests.`,
    `This property features ${generateArticle(
      bedroomDescriptions
    )} and toilets. The living room offers comfort and relaxation, and a spacious dining area is perfect for gatherings.`,
    `You'll love the ${bedroomDescriptions} and toilets in this property. The living room is designed for your comfort and relaxation, and a spacious dining area is an excellent place for get-togethers.`,
    `Step inside this property and explore the ${bedroomDescriptions} and toilets. The living room is your haven for comfort and relaxation, and a spacious dining area is the ideal setting for gatherings.`,
    `As you enter this property, you'll be impressed by the ${bedroomDescriptions} and toilets. The living room provides a cozy atmosphere, and a spacious dining area is perfect for social gatherings.`,
    `Inside this property, you'll be delighted by the ${bedroomDescriptions} and toilets. The living room is your sanctuary for relaxation, and the spacious dining area is perfect for hosting guests.`,
    `This property boasts of ${generateArticle(
      bedroomDescriptions
    )} and toilets. The living room offers comfort and relaxation, and a spacious dining area is perfect for gatherings.`,
    `With ${generateArticle(
      bedroomDescriptions
    )} and toilets, this property is designed for your comfort and relaxation. The living room and spacious dining area are excellent for get-togethers.`,
  ];
  return getRandomElementFromArray(middleStatements);
};

const generateRandomPropertyTitle = (name) => {
  const propertyNames = [
    `Discover the charm of ${name}`,
    `Explore the beauty of ${name}`,
    `Experience the allure of ${name}`,
    `Reveal the wonders of ${name}`,
    `Cherish the serenity of ${name}`,
    `Indulge in the luxury of ${name}`,
    `Enjoy the comfort of ${name}`,
    `Embrace the uniqueness of ${name}`,
    `Uncover the magic of ${name}`,
    `Delight in the elegance of ${name}`,
    `Savor the serenity of ${name}`,
    `Immerse yourself in the luxury of ${name}`,
    `Celebrate the beauty of ${name}`,
    `Experience the charm of ${name}`,
    `Explore the allure of ${name}`,
    `Revel in the wonders of ${name}`,
    `Discover the comfort of ${name}`,
    `Indulge in the uniqueness of ${name}`,
    `Appreciate the serenity of ${name}`,
    `Embrace the beauty of ${name}`,
  ];
  return getRandomElementFromArray(propertyNames);
};

const generateRandomLocationDescription = () => {
  const locations = [
    'a great neighborhood',
    'a peaceful area',
    'a central location',
    'the city center',
    'an exclusive place',
    'a quiet setting',
    'an ideal spot',
    'a lively district',
    'a convenient place',
    'a popular area',
    'a picturesque community',
    'a thriving locality',
    'a serene enclave',
    'a vibrant hub',
    'a prime destination',
    'a hidden gem',
    'a bustling neighborhood',
    'a tranquil oasis',
    'a sought-after locale',
    'an urban paradise',
    'an attractive precinct',
  ];
  return getRandomElementFromArray(locations);
};

const generateRandomPropertyTypeDescription = (type) => {
  const houseType = type.toLowerCase();
  const propertyTypes = [
    `a stylish ${houseType}`,
    `a luxurious ${houseType}`,
    'modern living spaces',
    `a contemporary ${houseType}`,
    `an elegant ${houseType}`,
    'a premium residence',
    'a cozy unit',
    'smart accommodation',
    `a high-class ${houseType}`,
    `a sophisticated ${houseType}`,
    `an exclusive ${houseType}`,
    `a luxury ${houseType}`,
    `a cozy ${houseType}`,
    `a modern ${houseType}`,
    `a contemporary ${houseType} living`,
    `premium ${houseType} spaces`,
    `an upscale ${houseType}`,
  ];
  return getRandomElementFromArray(propertyTypes);
};

const generateBedroomDescriptions = (bedrooms) => {
  const bedroomCount = bedrooms;
  const isStudio = bedroomCount === 1;
  return getRandomElementFromArray([
    `spacious ${bedroomCount}-bedroom`,
    isStudio ? `cozy studio` : `cozy ${bedroomCount}-bedroom`,
    `luxurious ${bedroomCount}-bedroom`,
    isStudio ? `elegant 1-bedroom` : `elegant ${bedroomCount}-bedroom`,
    isStudio ? `roomy 1-bedroom` : `roomy ${bedroomCount}-bedroom`,
    isStudio ? `comfortable studio` : `comfortable ${bedroomCount}-bedroom`,
    `inviting ${bedroomCount}-bedroom suite`,
    `stylish ${bedroomCount}-bedroom`,
    `modern ${bedroomCount}-bedroom`,
    `cozy ${bedroomCount}-bedroom`,
    isStudio ? `elegant studio` : `elegant ${bedroomCount}-bedroom`,
    isStudio ? `roomy studio` : `roomy ${bedroomCount}-bedroom`,
    `comfortable ${bedroomCount}-bedroom`,
  ]);
};

export const generatePropertyDescription = (property) => {
  if (!property) {
    return '';
  }

  const propertyTitle = generateRandomPropertyTitle(property?.name);
  const locationDescription = generateRandomLocationDescription();
  const propertyTypeDescription = generateRandomPropertyTypeDescription(
    property?.houseType
  );
  const bedroomDescriptions = generateBedroomDescriptions(property?.bedrooms);
  const featureDescription = generateRandomFeatureDescription();
  const endingStatement = generateRandomEndingStatement();
  const middleStatement = generateRandomMiddleStatement(bedroomDescriptions);
  const address = getLocationFromAddress(property?.address, true);

  return `${propertyTitle}, located in ${locationDescription} in ${address}. This property features ${propertyTypeDescription}, appealing to those interested in ${featureDescription}.

${middleStatement}

${
  property?.name
} offers ${featureDescription}. The property is priced at ${moneyFormatInNaira(
    property?.price
  )}${
    property?.titleDocument
      ? ` and includes ${getAutoCompleteAsString(
          property?.titleDocument
        )} title`
      : ''
  }. Find it at ${address}.

${endingStatement}`;
};
