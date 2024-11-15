#!/bin/bash 

#Search for an existing container
CONTAINERID=$(docker ps -a -q -f name=openelisglobal-webapp)
echo $CONTAINERID

if [[ $CONTAINERID != "" ]]
then
	echo "---- We have a container to Re-Use ----"

	# For now instead of removing and building the container, just replace the files

	# This is for reports
	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports
	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/languages/message_en.properties

	docker cp src/main/resources/reports $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes
	docker cp src/main/resources/languages/message_en.properties $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/languages/message_en.properties

else
	echo "---- There is no OpenELIS docker container. Building a new one ----"
fi
