Masterserver and scoreboard for the HS-Mannheim CTF for the course SSE

Installation of a NON-Production instance:

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo apt-get install libcurl4 openssl

!!!!!!!IF used in production evn -> https://docs.mongodb.com/manual/administration/production-notes/

sudo service mongod start
sudo cat /var/log/mongodb/mongod.log
//YOUR good to go == [initandlisten] waiting for connections on port 27017

STOP: sudo service mongod stop
ACCESS: mongo --host 127.0.0.1:27017
