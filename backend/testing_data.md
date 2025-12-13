# post data
{
  "url": "https://aws.com",
  "title": "AWS-amazon web services",
  "notes": "cloud based platform for computing resources",
  "tags": ["cloud", "amazon"],
  "archived": false,
}

# get by id
http://127.0.0.1:5000/api/bookmarks/11

# get all
http://127.0.0.1:5000/api/bookmarks

# updates
http://127.0.0.1:5000/api/bookmarks/11
{
  "tags": ["cloud", "amazon","web-service"]
}

#serch by tag
http://127.0.0.1:5000/api/bookmarks?tags=Python

# archive status
http://127.0.0.1:5000/api/bookmarks/11/archive

# delete

http://127.0.0.1:5000/api/bookmarks/11




# cli
# create
python linkvault_client.py create "https://www.geeksforgeeks.org/python/python-projects-beginner-to-advanced/" --title "python projects" --tags projects,python,geeksforgeeks

# update
python linkvault_client.py update 11 --tags projects,python,geeksforgeeks,learning

# list
python linkvault_client.py list
# filter by tags
python linkvault_client.py list --tag python
# filter by page
python linkvault_client.py list --page 2
# filter by keyword
python linkvault_client.py list --q projects 
# filter by archive status
python linkvault_client.py list --archived

# toggle-archive
python linkvault_client.py toggle-archive 7

# delete
python linkvault_client.py delete 11

# export
python linkvault_client.py export my_bookmarks.html

start my_bookmarks.html 



<!-- Document which states functionalities of project -->


python linkvault_client.py signup --name "dhruv naik" --email "dhruv@gmail.com" --username dhruv --password dhruv
python linkvault_client.py login --username dhruv --password dhruv

python linkvault_client.py create "https://example.com"
python linkvault_client.py create "https://google.com" --title "Google" --notes "Search engine" --tags search,tech
python linkvault_client.py create "https://github.com" --tags code --tags dev --tags tools

python linkvault_client.py list 

python linkvault_client.py list --tag tech 
python linkvault_client.py list --q google

python linkvault_client.py update 2 --title "Updated Google Title" #error
python linkvault_client.py update 2 --notes "Updated Google Notes"
python linkvault_client.py update 2 --tags search,reference
python linkvault_client.py update 2 --archived
python linkvault_client.py update 2 --unarchive

python linkvault_client.py toggle_archive 2 #error

python linkvault_client.py export exported_bookmarks.html

python linkvault_client.py qr 2

python linkvault_client.py delete 3  #error
python linkvault_client.py logout



# error
python linkvault_client.py update 2 --title "Updated Google Title" #error
python linkvault_client.py update 2 --notes "Updated Google Notes"
python linkvault_client.py update 2 --tags search,reference
python linkvault_client.py update 2 --archived
python linkvault_client.py update 2 --unarchive
python linkvault_client.py toggle_archive 2 #error
python linkvault_client.py delete 3  #error