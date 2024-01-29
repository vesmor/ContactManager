# Api Documentation


- [Api Documentation](#api-documentation)
	- [login](#login)
		- [POST](#post)
			- [Request](#request)
			- [Returns](#returns)
	- [signup](#signup)
		- [POST](#post-1)
			- [Request](#request-1)
			- [Returns](#returns-1)
	- [AddContacts](#addcontacts)
		- [POST](#post-2)
			- [Request](#request-2)
			- [Returns](#returns-2)
	- [DeleteContacts](#deletecontacts)
		- [POST](#post-3)
			- [Request](#request-3)
			- [Returns](#returns-3)
	- [SearchContacts](#searchcontacts)
		- [POST](#post-4)
			- [Request](#request-4)
			- [Returns](#returns-4)
	- [UpdateContacts](#updatecontacts)
		- [POST](#post-5)
			- [Request](#request-5)
			- [Returns](#returns-5)

## login
### POST
#### Request
login - Username of the user logging in \
pass - Password of the user logging in
```json 
{
	"login": string,
	"password": string
}

```
#### Returns
json body \
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
json body \
Empty error string
```json 
{
	"error": ""
}

```

<br>

## DeleteContact

### POST
#### Request
Delete the contact with the ID number passed in. ID can be found through doing a SearchContact request.
```json 
{
	"ID": int,
}

```
#### Returns
json body \
Empty error string
```json 
{
	"error": ""
}

```

<br>

## SearchContacts

Searches for Contact entries that belong to userID, and match partially with a searchTerm. \ 
For example if looking for all contacts that contain an "a" but belong to userID 4. \
ProTip: It's possible to load all contacts available to a certain user by passing an empty searchTerm string "" and the UserID it belongs to.
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

"results":[

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
Note: ID is the ID the Contact is identified as in it's table. And userID is the ID of the User that this contact belongs to. \
&nbsp; IE: The Contact, John, may have the ID of 4 in its table but belongs to the User Mark, who has the UserID of 8.

<br>

## UpdateContacts
Updates the names, phone, and email fields of the Contact found with the ID number passed in.
### POST
#### Request

```json 
{
	"FirstName": string,
	"LastName": string,
	"Phone": string,
	"Email": string,
	"ID": int
}

```
#### Returns
json body \
Empty error string
```json 
{
	"error": ""
}

```
