const fs = require('fs');
const path = require('path');
const { generateTheme } = require('antd-theme-generator');

// Specify the name of the theme variables to be changed, default is `@primary-color`
// Can be set all antd & ng-alain custom theme variables
const themeVariables = ['@primary-color'];

const root = path.resolve(__dirname, '../../../');
const appControl = path.join(root, 'apps/control');
const tmpVarFilePath = path.join(appControl, 'scripts/var.less');
const outputFilePath = path.join(appControl, 'assets/alain-default.less');

const options = {
  stylesDir: appControl,
  antdStylesDir: path.join(root, './node_modules/ng-zorro-antd'),
  varFile: path.join(appControl, './scripts/var.less'),
  mainLessFile: path.join(appControl, './styles.less'),
  themeVariables,
  outputFilePath,
};

function genVarFile() {
  const ALLVAR = `
  @import '~@delon/theme/theme-default';
  @import '../styles/theme.less';
  `;

  fs.writeFileSync(tmpVarFilePath, ALLVAR);
}

function removeVarFile() {
  fs.unlinkSync(tmpVarFilePath);
}

function removeOutputFile() {
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }
}

genVarFile();
removeOutputFile();
generateTheme(options)
  .then(() => {
    removeVarFile();
    console.log('Theme generated successfully');
  })
  .catch((error) => {
    removeVarFile();
    console.log('Error', error);
  });
