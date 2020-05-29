# all commands

## npm-check-updates: check all dependencies

1. `npm i -g npm-check-updates`(optional)
2. `ncu -u`
3. `npm i`

## ng g

1. `ng g application admin --skipInstall=true --prefix=leaf --style=less --routing=false`
2. `ng g library core --skipInstall=true --prefix=leaf`

## git cz

1. `npm i -g cz-conventional-changelog`
2. add code `"commit": "git cz"` to package.json
3. run `npm run commit`

## changlog:git change log

> reference: [git commit 、CHANGELOG 和版本发布的标准自动化](https://www.cnblogs.com/zivxiaowei/p/10089201.html)

1. install conventionla-changelog-cli: `npm i -g conventional-changelog-cli`
2. create CHANGELOG.md: `conventional-changelog -p angular -i CHANGELOG.md -s`

## jest: test framewrok

1. `yarn global add jest`: install jest
2. `jest --init`: craete `jest.config.js`

## lerna：A tool for managing JS projects with multiple packages

1. `yarn global add lerna`: install lerna
2. `lerna init`: create `lerna.json`
