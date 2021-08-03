# Validation rules

## Types
### [x] array
Verifies if the field is an array

### [x] object
Verifies if the field is an object

### [x] string
Verifies if the field is a string

### [x] number
Verifies if the field is a number. Has an argument to stricly accept only types of number, but not convertable ones.

### [x] truthy
Verifies if the field is equivalent to truth

### [ ] falsy
Verifies if the field is equivalent to false

### [ ] date
Checks for a valid date format

## Enhancement
### [x] required 
Verifies if the field is present

### [x] confirmed 
Requires that the fields object contain another field with <fieldName>_confirmation and that the value matches

## Internet
### [x] email
Regex the email format, does not actually validate if the email is functional

### [ ] url
Regex to match a web url

## Special
### [ ] min
If string, will count the quantity of characters, if a number, will count the actual number size

### [ ] max
If string, will count the quantity of characters, if a number, will count the actual number size

