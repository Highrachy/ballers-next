const StyleDictionary = require('style-dictionary');
const path = require('path');
const fs = require('fs');

console.log('   HomeKeeping...');

// Define the path to the output folder
const outputDir = path.join(__dirname, '/build/');

// Delete the output folder if it exists
if (fs.existsSync(outputDir)) {
  fs.rmdirSync(outputDir, { recursive: true });
}

console.log('Build started...');
console.log('\n==============================================');

StyleDictionary.registerTransform({
  name: 'name/scss',
  type: 'name',
  transformer: (token) => {
    return token.path.slice(1, token.path.length).join('-');
  },
});

StyleDictionary.registerTransform({
  // this is a silly example, to show how you can apply transform to names
  name: 'name/squiggle',
  type: 'name',
  // notice: if you don't specify a matcher, the transformation will be applied to all the tokens
  transformer: function (token) {
    return token.path.join('~');
  },
});

// REGISTER THE CUSTOM TRANSFORM GROUPS

// if you want to see what a pre-defined group contains, uncomment the next line:
console.log(StyleDictionary.transformGroup['scss']);

StyleDictionary.registerTransformGroup({
  name: 'custom1/scss',
  // notice: here the "size/px" transform is not the pre-defined one, but the custom one we have declared above
  transforms: [
    'attribute/cti',
    'name/scss',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/css',
  ],
});

// StyleDictionary.registerTransformGroup({
//   name: 'custom/scss',
//   // this is to show one possibility for adding a few transforms to a pre-defined group
//   // (however, we suggest to use the previous approach, which is more explicit and clear)
//   transforms: StyleDictionary.transformGroup['scss'].concat(['name/scss']),
// });

StyleDictionary.registerFormat({
  name: 'custom/color/object',
  formatter(dictionary) {
    const colors = {};
    Object.keys(dictionary.properties.color).forEach((colorName) => {
      const color = dictionary.properties.color[colorName];
      const colorGroup = {};
      Object.keys(color).forEach((item) => {
        colorGroup[item] = `'${color[item].value}'`;
      });
      colors[colorName] = colorGroup;
    });
    return `module.exports = ${JSON.stringify(colors, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '')};`;
  },
});

StyleDictionary.registerFormat({
  name: 'custom/scss',
  formatter(dictionary, config) {
    let scss = '';
    Object.keys(dictionary.properties.color).forEach((colorName) => {
      const color = dictionary.properties.color[colorName];
      Object.keys(color).forEach((item) => {
        if (item !== 'name') {
          const variableName = `$${colorName}-${item}`;
          const variableValue = color[item].value;
          scss += `${variableName}: ${variableValue};\n`;
        }
      });
    });
    return scss;
  },
});

StyleDictionary.registerFormat({
  name: 'custom/sourceFile',
  formatter(dictionary, config) {
    return JSON.stringify(dictionary, null, 2);
  },
});
// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const StyleDictionaryExtended = StyleDictionary.extend(
  __dirname + '/config.json'
);

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtended.buildAllPlatforms();

console.log('\n==============================================');
console.log('\nBuild completed!');
