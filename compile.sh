#!/bin/bash 

# First compile the code
#mvn install -DskipTests -o

#Search for an existing container
CONTAINERID=$(docker ps -a -q -f name=openelisglobal-webapp)
echo $CONTAINERID

if [[ $CONTAINERID != "" ]]
then
	echo "---- We have a container to Re-Use ----"
	#docker stop $CONTAINERID && docker rm -f $CONTAINERID
	#docker-compose up -d --build

	# For now instead of removing and building the container, just replace the files
 # 	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global.war
  #	docker cp target/OpenELIS-Global.war $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global.war

	# This is for reports
	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/CDIHeader.jasper
	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/CDIHeader.jrxml
	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/PatientReportCDI_vreduit.jasper
	docker exec -u 0 -it $CONTAINERID rm -fr /usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/PatientReportCDI_vreduit.jrxml

	docker cp src/main/resources/reports/CDIHeader.jasper $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/CDIHeader.jasper
	docker cp src/main/resources/reports/CDIHeader.jrxml $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/CDIHeader.jrxml
	docker cp src/main/resources/reports/PatientReportCDI_vreduit.jasper $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/PatientReportCDI_vreduit.jasper
	docker cp src/main/resources/reports/PatientReportCDI_vreduit.jrxml $CONTAINERID:/usr/local/tomcat/webapps/OpenELIS-Global/WEB-INF/classes/reports/PatientReportCDI_vreduit.jrxml

else
	echo "---- There is no OpenELIS docker container. Building a new one ----"
	# Build and start the new container
	#docker-compose up -d --build
fi
