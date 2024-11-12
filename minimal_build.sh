#!/bin/bash

OPT_STRING=":of"
OE=0
FE=0
while getopts ${OPT_STRING} opt; do
    case $opt in
        o) OE=1 ;;
        f) FE=1 ;;
        ?)
            echo "Invalid option: -${OPTARG}. Accepts o or f"
            exit 1
        ;;
    esac
done

if [[ "$OE" == 0  &&  "$FE" == 0 ]];
then
    OE=1
    FE=1
fi

CALL_DIR=$PWD

INSTALLER_DIR="OEInstaller"
mkdir -p ${INSTALLER_DIR}

#get location of this script
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  BUILD_SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
BUILD_SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
INSTALL_DIR="${BUILD_SCRIPT_DIR}/install"

#and other important locations
PROJECT_DIR="${BUILD_SCRIPT_DIR}"

cd ${PROJECT_DIR} || exit
VERSION=$(mvn build-helper:parse-version help:evaluate -Dexpression=project.version  -q -DforceStdout)

cd ${CALL_DIR} || exit

if [ "$OE" == 1 ];
then
    echo "create the openelisglobal docker image"
    bash ${INSTALL_DIR}/buildProject.sh -dl ${PROJECT_DIR} -t openelisglobal:$VERSION
    SUCCESS=$?
    if [ $SUCCESS != 0 ]
    then
        echo
        echo build failed openelisglobal
        exit $SUCCESS
    fi
fi

if [ "$FE" == 1 ];
then
    echo "create the frontend docker image"
    bash ${INSTALL_DIR}/buildProject.sh -dl ${PROJECT_DIR}/frontend -t openelisglobal-frontend:$VERSION
    SUCCESS=$?
    if [ $SUCCESS != 0 ]
    then
        echo
        echo build failed openelisglobal-frontend
        exit $SUCCESS
    fi
fi

if [ "$OE" == 1 ];
then
    cd ${CALL_DIR} || exit
    echo "saving docker image as OpenELIS-Global_DockerImage.tar.gz"
    docker save openelisglobal:$VERSION | gzip > ${INSTALLER_DIR}/OpenELIS-Global_DockerImage-${VERSION}.tar.gz
fi

if [ "$FE" == 1 ];
then
    cd ${CALL_DIR} || exit
    echo "saving React frontend docker image"
    docker save openelisglobal-frontend:$VERSION | gzip > ${INSTALLER_DIR}/ReactFrontend_DockerImage-${VERSION}.tar.gz
fi
