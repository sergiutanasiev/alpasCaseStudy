# alpasCaseStudy

## Install
Run `npm i`

## Start
Run `npm run start`

## Access
`localhost:3000`

## Description

While input is focused text can be written even if a country is currently selected.

Two available lists

`Available countries` Are the total list of countries available\
`Suggested countries` Filtered countries by name or caa2; caa2 has priority in list

# Search features
when searching by matcthing caa2 country will be first in list ex: `DE` first in suggested list will be `Germany`

Selected country will be saved to local storage.\
Upon refreshing the page the country will be reselected

To remove the country from localstorage click clear

Using left or right arrow will clear the input value and reset the list to initial list of countries

When using up and down arrow keys a country will be temporary selected to confirm selection click enter or mouse click