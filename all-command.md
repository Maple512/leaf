# all commands

## npm-check-updates: update all dependencies

1. `npm i -g npm-check-updates`(optional)
2. `ncu -u`
3. `npm i`

## ng g

1. `ng g application admin --skipInstall=true --prefix=leaf --style=less --routing=false`
2. `ng g library core --skipInstall=true --prefix=leaf`

## changlog

> reference: [git commit 、CHANGELOG 和版本发布的标准自动化](https://www.cnblogs.com/zivxiaowei/p/10089201.html)

1. install conventionla-changelog-cli: `npm i -g conventional-changelog-cli`
2. create CHANGELOG.md: `conventional-changelog -p angular -i CHANGELOG.md -s`
