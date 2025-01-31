import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Form,
  Heading,
  Button,
  Loading,
  Grid,
  Column,
  Section,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableSelectRow,
  TableSelectAll,
  TableContainer,
  Pagination,
  Search,
  Select,
  SelectItem,
  Stack,
  Checkbox,
} from "@carbon/react";
import {
  getFromOpenElisServer,
  postToOpenElisServer,
  postToOpenElisServerFormData,
  postToOpenElisServerFullResponse,
  postToOpenElisServerJsonResponse,
} from "../../utils/Utils.js";
import { NotificationContext } from "../../layout/Layout.js";
import {
  AlertDialog,
  NotificationKinds,
} from "../../common/CustomNotification.js";
import { FormattedMessage, injectIntl, useIntl } from "react-intl";
import PageBreadCrumb from "../../common/PageBreadCrumb.js";
import CustomCheckBox from "../../common/CustomCheckBox.js";
import ActionPaginationButtonType from "../../common/ActionPaginationButtonType.js";
import { use } from "react";

let breadcrumbs = [
  { label: "home.label", link: "/" },
  { label: "breadcrums.admin.managment", link: "/MasterListsPage" },
  {
    label: "master.lists.page.test.management",
    link: "/MasterListsPage#testManagementConfigMenu",
  },
  {
    label: "configuration.test.orderable",
    link: "/MasterListsPage#TestOrderability",
  },
];

function TestOrderability() {
  const { notificationVisible, setNotificationVisible, addNotification } =
    useContext(NotificationContext);

  const intl = useIntl();

  const componentMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testOrderabilityData, setTestOrderabilityData] = useState({});
  const [jsonChangeList, setJsonChangeList] = useState({
    activateTest: [],
    deactivateTest: [],
  });

  const handleActiveTestsCheckboxChange = (test, sampleTypeId, isChecked) => {
    setTestOrderabilityData((prev) => {
      let orderableTestList = [...prev.orderableTestList];

      orderableTestList = orderableTestList.map((sample) => {
        if (sample.sampleType.id === sampleTypeId) {
          // Check if sampleType.id matches
          let activeTests = [...sample.activeTests];
          let inactiveTests = [...sample.inactiveTests];

          if (isChecked === true) {
            inactiveTests = inactiveTests.filter((item) => item.id !== test.id);
            if (!activeTests.some((item) => item.id === test.id)) {
              activeTests.push(test); // Add full test object
            }
          } else {
            activeTests = activeTests.filter((item) => item.id !== test.id);
            if (!inactiveTests.some((item) => item.id === test.id)) {
              inactiveTests.push(test); // Add full test object
            }
          }

          return { ...sample, activeTests, inactiveTests };
        }
        return sample; // Return sample as is if sampleType.id does not match
      });

      return { ...prev, orderableTestList };
    });

    setJsonChangeList((prev) => {
      let activateTest = [...prev.activateTest];
      let deactivateTest = [...prev.deactivateTest];

      if (isChecked === true) {
        if (
          !activateTest.some((item) => item.id === test.id) &&
          !deactivateTest.some((item) => item.id === test.id)
        ) {
          activateTest.push({ id: test.id }); // Only push the test id to jsonChangeList
        }
        deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
      } else {
        activateTest = activateTest.filter((item) => item.id !== test.id);
        if (!deactivateTest.some((item) => item.id === test.id)) {
          deactivateTest.push({ id: test.id }); // Only push the test id to jsonChangeList
        }
      }

      return { activateTest, deactivateTest };
    });
  };

  const handleInactiveTestsCheckboxChange = (test, sampleTypeId, isChecked) => {
    setTestOrderabilityData((prev) => {
      let orderableTestList = [...prev.orderableTestList];

      orderableTestList = orderableTestList.map((sample) => {
        if (sample.sampleType.id === sampleTypeId) {
          // Check if sampleType.id matches
          let activeTests = [...sample.activeTests];
          let inactiveTests = [...sample.inactiveTests];

          if (isChecked === false) {
            activeTests = activeTests.filter((item) => item.id !== test.id);
            if (!inactiveTests.some((item) => item.id === test.id)) {
              inactiveTests.push(test); // Add full test object
            }
          } else {
            inactiveTests = inactiveTests.filter((item) => item.id !== test.id);
            if (!activeTests.some((item) => item.id === test.id)) {
              activeTests.push(test); // Add full test object
            }
          }

          return { ...sample, activeTests, inactiveTests };
        }
        return sample;
      });

      return { ...prev, orderableTestList };
    });

    setJsonChangeList((prev) => {
      let activateTest = [...prev.activateTest];
      let deactivateTest = [...prev.deactivateTest];

      if (isChecked === false) {
        if (
          !deactivateTest.some((item) => item.id === test.id) &&
          !activateTest.some((item) => item.id === test.id)
        ) {
          deactivateTest.push({ id: test.id });
        }
        activateTest = activateTest.filter((item) => item.id !== test.id);
      } else {
        deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        if (!activateTest.some((item) => item.id === test.id)) {
          activateTest.push({ id: test.id });
        }
      }

      return { activateTest, deactivateTest };
    });
  };

  function handleTestOrderabilityData(res) {
    if (!res) {
      setIsLoading(true);
    } else {
      setTestOrderabilityData(res);
    }
  }

  function testOrderabilityPostCall() {
    setIsLoading(true);
    postToOpenElisServerJsonResponse(
      `/rest/TestOrderability`,
      JSON.stringify({
        jsonChangeList: JSON.stringify({
          activateTest: JSON.stringify(jsonChangeList.activateTest),
          deactivateTest: JSON.stringify(jsonChangeList.deactivateTest),
        }),
      }),
      (res) => testOrderabilityPostCallback(res),
    );
  }

  function testOrderabilityPostCallback(res) {
    if (res) {
      setIsLoading(false);
      addNotification({
        title: intl.formatMessage({
          id: "notification.title",
        }),
        message: intl.formatMessage({
          id: "notification.user.post.save.success",
        }),
        kind: NotificationKinds.success,
      });
      setNotificationVisible(true);
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } else {
      addNotification({
        kind: NotificationKinds.error,
        title: intl.formatMessage({ id: "notification.title" }),
        message: intl.formatMessage({ id: "server.error.msg" }),
      });
      setNotificationVisible(true);
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  }

  useEffect(() => {
    componentMounted.current = true;
    setIsLoading(true);
    getFromOpenElisServer(`/rest/TestOrderability`, (res) => {
      handleTestOrderabilityData(res);
    });
    return () => {
      componentMounted.current = false;
      setIsLoading(false);
    };
  }, []);

  if (!isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      {notificationVisible && <AlertDialog />}
      <div className="adminPageContent">
        <PageBreadCrumb breadcrumbs={breadcrumbs} />
        <div className="orderLegendBody">
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Section>
                <Heading>
                  <FormattedMessage id="configuration.test.orderable" />
                </Heading>
              </Section>
            </Column>
          </Grid>
          <br />
          <hr />
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Section>
                <Section>
                  <Section>
                    <Section>
                      <Heading>
                        <FormattedMessage id="instructions.test.order" />
                      </Heading>
                    </Section>
                  </Section>
                </Section>
              </Section>
            </Column>
          </Grid>
          <hr />
          <br />
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Button
                disabled={
                  jsonChangeList.activateTest.length === 0 &&
                  jsonChangeList.deactivateTest.length === 0
                }
                onClick={() => {
                  testOrderabilityPostCall();
                }}
                type="button"
              >
                <FormattedMessage id="label.button.submit" />
              </Button>{" "}
              <Button
                onClick={() =>
                  window.location.assign(
                    "/MasterListsPage#testManagementConfigMenu",
                  )
                }
                kind="tertiary"
                type="button"
              >
                <FormattedMessage id="label.button.cancel" />
              </Button>
            </Column>
          </Grid>
          <br />
          {testOrderabilityData?.orderableTestList &&
          testOrderabilityData?.orderableTestList.length > 0 ? (
            <Grid fullWidth={true}>
              {testOrderabilityData?.orderableTestList?.map((sample) => (
                <>
                  <Column lg={16} md={8} sm={4} key={sample.sampleType.id}>
                    <Section>
                      <Section>
                        <Section>
                          <Heading>{sample.sampleType.value}</Heading>
                        </Section>
                      </Section>
                    </Section>
                  </Column>
                  {sample.activeTests?.map((test) => (
                    <Column lg={4} md={4} sm={4} key={test.id}>
                      <Checkbox
                        id={test.id}
                        labelText={test.value}
                        checked={true}
                        onChange={(_, { checked }) =>
                          handleActiveTestsCheckboxChange(
                            test,
                            sample.sampleType.id,
                            checked,
                          )
                        }
                      />
                    </Column>
                  ))}
                  {sample.inactiveTests?.map((test) => (
                    <Column lg={4} md={4} sm={4} key={test.id}>
                      <Checkbox
                        id={test.id}
                        labelText={test.value}
                        checked={false}
                        onChange={(_, { checked }) =>
                          handleInactiveTestsCheckboxChange(
                            test,
                            sample.sampleType.id,
                            checked,
                          )
                        }
                      />
                    </Column>
                  ))}
                </>
              ))}
            </Grid>
          ) : (
            <></>
          )}
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Button
                disabled={
                  jsonChangeList.activateTest.length === 0 &&
                  jsonChangeList.deactivateTest.length === 0
                }
                onClick={() => {
                  testOrderabilityPostCall();
                }}
                type="button"
              >
                <FormattedMessage id="label.button.submit" />
              </Button>{" "}
              <Button
                onClick={() =>
                  window.location.assign(
                    "/MasterListsPage#testManagementConfigMenu",
                  )
                }
                kind="tertiary"
                type="button"
              >
                <FormattedMessage id="label.button.cancel" />
              </Button>
            </Column>
          </Grid>
        </div>
        <button
          onClick={() => {
            console.log(testOrderabilityData);
          }}
        >
          testOrderabilityData
        </button>
        <button
          onClick={() => {
            console.log(jsonChangeList);
          }}
        >
          jsonChangeList
        </button>
      </div>
    </>
  );
}

export default injectIntl(TestOrderability);
