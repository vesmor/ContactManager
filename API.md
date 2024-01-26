# Api Documentation


## login
### POST
#### Request
login - Username of the user logging in
pass - Password of the user logging in
```json 
{
	"login": string,
	"password": string
}

```
#### Returns
json body
error should usually be empty
```json 
{
	"id": int,
	"firstName": string,
	"lastName": string,
	"error": string
}

```

<br>

## signup
### POST
#### Request
```json 
{
	"FirstName": string,
	"LastName": string,
	"Username": string,
	"Password": string
}

```
#### Returns
Empty error string
```json
{
	"error": ""
}
```
  
<br>

## AddContacts

### POST
#### Request

```json 
{
	"FirstName": string,
	"LastName": string,
	"Phone": string,
	"Email": string,
	"UserID": int
}

```
#### Returns
json body
Empty error string
```json 
{
	"error": ""
}

```

<br>

## SearchContacts

Searches for Contact entries that belong to userID, and match partially with a searchTerm. 
For example if looking for all contacts that contain an "a" but belong to userID 4.
ProTip: It's possible to load all contacts available by passing an empty searchTerm string "" and the userID you wish to receive
### POST
#### Request
```json
{

	"searchTerm": string,
	"userID": int

}
```

#### Returns
Array JSON object named "results" with ID, FirstName, LastName, Phone, Email, UserID
```json
{

"results": [

	{

	"ID": int,
	"FirstName": string,
	"LastName": string,
	"Phone": string,
	"Email": string,
	"UserID": int

	},

	{
		"ID": int,
		"FirstName": string,
		...etc
	}

	]

}
```
Note: ID is the ID the Contact is identified as in it's table. And userID is the ID of the User that this contact belongs to.
&nbsp; IE: The Contact, John, may have the ID of 4 in its table but belongs to the User Mark, who has the UserID of 8.

