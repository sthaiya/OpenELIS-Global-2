#!/bin/bash 

# First compile the code
mvn install -DskipTests -o

#Search for an existing container
CONTAINERID=$(docker ps -a -q -f name=openelisglobal-webapp)
echo $CONTAINERID

if [[ $CONTAINERID != "" ]]
then
	echo "---- We have a container to Re-Use ----"
	#docker stop $CONTAINERID && docker rm -f $CONTAINERID
	#docker-compose up -d --build

	# For now instead of removing and building the container, just replace the files
	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global.war
	docker cp target/OpenELIS-Global.war $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global.war


else
	echo "---- There is no OpenELIS docker container. Building a new one ----"
	# Build and start the new container
	#docker-compose up -d --build
fi