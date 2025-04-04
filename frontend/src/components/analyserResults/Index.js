import React, { useContext, useState, useEffect } from "react";
import AnalyserResults from "./AnalyserResults";
import { AlertDialog } from "../common/CustomNotification";
import { NotificationContext } from "../layout/Layout";
import { NotificationKinds } from "../common/CustomNotification";
import {
  Heading,
  Grid,
  Column,
  Section,
  Link,
  Button,
  Loading,
} from "@carbon/react";
import { useIntl } from "react-intl";
import { getFromOpenElisServer } from "../utils/Utils";
import { ArrowLeft, ArrowRight } from "@carbon/react/icons";
import PageBreadCrumb from "../common/PageBreadCrumb";

let breadcrumbs = [{ label: "home.label", link: "/" }];

const Index = () => {
  const { notificationVisible, setNotificationVisible, addNotification } =
    useContext(NotificationContext);
  const [results, setResults] = useState({ resultList: [] });
  const [type, setType] = useState("");
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pagination, setPagination] = useState(false);
  const [currentApiPage, setCurrentApiPage] = useState(null);
  const [totalApiPages, setTotalApiPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [sampleGroup, setSampleGroup] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    let analyserType = new URLSearchParams(window.location.search).get("type");
    setType(analyserType);
  }, []);

  useEffect(() => {
    if (type) {
      setUrl("/rest/AnalyzerResults?type=" + type);
    }
  }, [type]);

  useEffect(() => {
    if (url) {
      getFromOpenElisServer(
        "/rest/AnalyzerResults?type=" + type,
        handleResults,
      );
    }
  }, [url]);

  const extractUniqueGroups = (data) => {
    const seenGroups = new Set();
    return data.filter((item) => {
      if (!seenGroups.has(item.sampleGroupingNumber)) {
        seenGroups.add(item.sampleGroupingNumber);
        return true;
      }
      return false;
    });
  };

  const loadNextResultsPage = () => {
    setIsLoading(true);
    getFromOpenElisServer(url + "&page=" + nextPage, handleResults);
  };

  const loadPreviousResultsPage = () => {
    setIsLoading(true);
    getFromOpenElisServer(url + "&page=" + previousPage, handleResults);
  };

  const handleResults = (data) => {
    if (data) {
      setResults(data);
      setIsLoading(false);
      if (data.paging) {
        var { totalPages, currentPage } = data.paging;
        if (totalPages > 1) {
          setPagination(true);
          setCurrentApiPage(currentPage);
          setTotalApiPages(totalPages);
          if (parseInt(currentPage) < parseInt(totalPages)) {
            setNextPage(parseInt(currentPage) + 1);
          } else {
            setNextPage(null);
          }
          if (parseInt(currentPage) > 1) {
            setPreviousPage(parseInt(currentPage) - 1);
          } else {
            setPreviousPage(null);
          }
        }
      }

      if (data.resultList.length == 0) {
        addNotification({
          kind: NotificationKinds.warning,
          title: intl.formatMessage({ id: "notification.title" }),
          message:
            intl.formatMessage({ id: "validation.search.noresult.analyser" }) +
            type,
        });
        setNotificationVisible(true);
      } else {
        setSampleGroup(extractUniqueGroups(data.resultList));
      }
    }
  };
  return (
    <>
      <PageBreadCrumb breadcrumbs={breadcrumbs} />
      <Grid fullWidth={true}>
        <Column lg={16} md={8} sm={4}>
          <Section>
            <Section>
              <Heading>{type}</Heading>
            </Section>
          </Section>
        </Column>
      </Grid>
      <div className="orderLegendBody">
        {notificationVisible === true ? <AlertDialog /> : ""}
        {isLoading && <Loading></Loading>}
        <>
          {pagination && (
            <Grid>
              <Column lg={14} />
              <Column
                lg={2}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  width: "110%",
                }}
              >
                <Link>
                  {currentApiPage} / {totalApiPages}
                </Link>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    hasIconOnly
                    id="loadpreviousresults"
                    onClick={loadPreviousResultsPage}
                    disabled={previousPage != null ? false : true}
                    renderIcon={ArrowLeft}
                    iconDescription="previous"
                  ></Button>
                  <Button
                    hasIconOnly
                    id="loadnextresults"
                    onClick={loadNextResultsPage}
                    disabled={nextPage != null ? false : true}
                    renderIcon={ArrowRight}
                    iconDescription="next"
                  ></Button>
                </div>
              </Column>
            </Grid>
          )}
        </>
        <AnalyserResults
          type={type}
          results={results}
          sampleGroup={sampleGroup}
        />
      </div>
    </>
  );
};

export default Index;
