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
  Modal,
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
import SortableTestList, {
  SortableSampleTypeList,
} from "./sortableListComponent/SortableList.js";

let breadcrumbs = [
  { label: "home.label", link: "/" },
  { label: "breadcrums.admin.managment", link: "/MasterListsPage" },
  {
    label: "master.lists.page.test.management",
    link: "/MasterListsPage#testManagementConfigMenu",
  },
  {
    label: "configuration.testUnit.manage",
    link: "/MasterListsPage#TestSectionManagement",
  },
  {
    label: "configuration.testUnit.create",
    link: "/MasterListsPage#TestActivation",
  },
];

function TestActivation() {
  const { notificationVisible, setNotificationVisible, addNotification } =
    useContext(NotificationContext);

  const intl = useIntl();

  const componentMounted = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [testActivationData, setTestActivationData] = useState({});
  const [changedTestActivationData, setChangedTestActivationData] = useState(
    {},
  );
  const [jsonChangeList, setJsonChangeList] = useState({
    activateSample: [],
    deactivateSample: [],
    activateTest: [],
    deactivateTest: [],
  });

  function handleTestActivationData(res) {
    if (!res) {
      setIsLoading(true);
    } else {
      setTestActivationData(res);
      setChangedTestActivationData(res);
    }
  }

  const handleActiveTestListCheckboxChangeActiveTests = (
    test,
    sampleTypeId,
    isChecked,
  ) => {
    setChangedTestActivationData((prev) => {
      let activeTestList = [...prev.activeTestList];
      let inactiveTestList = [...prev.inactiveTestList];

      let movedSampleType = null;

      activeTestList = activeTestList
        .map((sample) => {
          if (sample.sampleType.id === sampleTypeId) {
            let activeTests = [...sample.activeTests];
            let inactiveTests = [...sample.inactiveTests];

            const originalState = testActivationData.activeTestList.find(
              (sample) => sample.sampleType.id === sampleTypeId,
            );

            if (activeTests.some((t) => t.id === test.id)) {
              if (isChecked === true) {
                inactiveTests = inactiveTests.filter(
                  (item) => item.id !== test.id,
                );
                if (!activeTests.some((item) => item.id === test.id)) {
                  // const originalIndex = originalState.activeTests.findIndex(
                  //   (t) => t.id === test.id,
                  // );
                  // if (originalIndex !== -1) {
                  //   activeTests.splice(originalIndex, 0, test);
                  // } else {
                  //   activeTests.push(test);
                  // }
                  activeTests.push(test);
                }
              } else {
                activeTests = activeTests.filter((item) => item.id !== test.id);
                if (!inactiveTests.some((item) => item.id === test.id)) {
                  // const originalIndex = originalState.inactiveTests.findIndex(
                  //   (t) => t.id === test.id,
                  // );
                  // if (originalIndex !== -1) {
                  //   inactiveTests.splice(originalIndex, 0, test);
                  // } else {
                  //   inactiveTests.push(test);
                  // }
                  inactiveTests.push(test);
                }
              }
            }

            if (activeTests.length === 0) {
              movedSampleType = {
                sampleType: sample.sampleType,
                activeTests: [],
                inactiveTests: [...inactiveTests],
              };
              return null;
            }

            return { ...sample, activeTests, inactiveTests };
          }
          return sample;
        })
        .filter(Boolean);

      if (movedSampleType) {
        let existingSample = inactiveTestList.find(
          (sample) => sample.sampleType.id === sampleTypeId,
        );

        let updatedInactiveTestList = inactiveTestList.map((sample) =>
          sample.sampleType.id === sampleTypeId
            ? {
                ...sample,
                inactiveTests: [
                  ...sample.inactiveTests,
                  ...movedSampleType.inactiveTests,
                ],
              }
            : sample,
        );

        if (!existingSample) {
          updatedInactiveTestList.push(movedSampleType);
        }

        return {
          ...prev,
          activeTestList,
          inactiveTestList: updatedInactiveTestList,
        };
      }

      return { ...prev, activeTestList };
    });

    // setJsonChangeList((prev) => {
    //   let activateTest = [...prev.activateTest];
    //   let deactivateTest = [...prev.deactivateTest];

    //   const originalState = testActivationData.activeTestList.find(
    //     (sample) => sample.sampleType.id === sampleTypeId,
    //   );

    //   const isOriginallyActive = originalState.activeTests.some(
    //     (t) => t.id === test.id,
    //   );

    //   if (isChecked === true) {
    //     if (!isOriginallyActive) {
    //       if (!activateTest.some((item) => item.id === test.id)) {
    //         activateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   } else {
    //     if (isOriginallyActive) {
    //       if (!deactivateTest.some((item) => item.id === test.id)) {
    //         deactivateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   }

    //   return { activateTest, deactivateTest };
    // });
  };

  const handleActiveTestListCheckboxChangeInactiveTests = (
    test,
    sampleTypeId,
    isChecked,
  ) => {
    setChangedTestActivationData((prev) => {
      let activeTestList = [...prev.activeTestList];

      activeTestList = activeTestList.map((sample) => {
        if (sample.sampleType.id === sampleTypeId) {
          let activeTests = [...sample.activeTests];
          let inactiveTests = [...sample.inactiveTests];

          if (inactiveTests.some((t) => t.id === test.id)) {
            if (isChecked === true) {
              inactiveTests = inactiveTests.filter(
                (item) => item.id !== test.id,
              );
              if (!activeTests.some((item) => item.id === test.id)) {
                activeTests.push(test);
              }
            } else {
              activeTests = activeTests.filter((item) => item.id !== test.id);
              if (!inactiveTests.some((item) => item.id === test.id)) {
                inactiveTests.push(test);
              }
            }
          }

          return { ...sample, activeTests, inactiveTests };
        }
        return sample;
      });

      return { ...prev, activeTestList };
    });

    // setJsonChangeList((prev) => {
    //   let activateTest = [...prev.activateTest];
    //   let deactivateTest = [...prev.deactivateTest];

    //   const originalState = testActivationData.activeTestList.find(
    //     (sample) => sample.sampleType.id === sampleTypeId,
    //   );

    //   const isOriginallyActive = originalState.activeTests.some(
    //     (t) => t.id === test.id,
    //   );

    //   if (isChecked === true) {
    //     if (!isOriginallyActive) {
    //       if (!activateTest.some((item) => item.id === test.id)) {
    //         activateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   } else {
    //     if (isOriginallyActive) {
    //       if (!deactivateTest.some((item) => item.id === test.id)) {
    //         deactivateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   }

    //   return { activateTest, deactivateTest };
    // });
  };

  const handleInactiveTestListCheckboxChangeActiveTests = (
    test,
    sampleTypeId,
    isChecked,
  ) => {
    setChangedTestActivationData((prev) => {
      let inactiveTestList = [...prev.inactiveTestList];

      inactiveTestList = inactiveTestList.map((sample) => {
        if (sample.sampleType.id === sampleTypeId) {
          let activeTests = [...sample.activeTests];
          let inactiveTests = [...sample.inactiveTests];

          const originalState = testActivationData.inactiveTestList.find(
            (sample) => sample.sampleType.id === sampleTypeId,
          );

          if (
            activeTests.some((t) => t.id === test.id) ||
            inactiveTests.some((t) => t.id === test.id)
          ) {
            if (isChecked === false) {
              activeTests = activeTests.filter((item) => item.id !== test.id);
              if (!inactiveTests.some((item) => item.id === test.id)) {
                // const originalIndex = originalState.inactiveTests.findIndex(
                //   (t) => t.id === test.id,
                // );
                // if (originalIndex !== -1) {
                //   inactiveTests.splice(originalIndex, 0, test);
                // } else {
                //   inactiveTests.push(test);
                // }
                inactiveTests.push(test);
              }
            } else {
              inactiveTests = inactiveTests.filter(
                (item) => item.id !== test.id,
              );
              if (!activeTests.some((item) => item.id === test.id)) {
                // const originalIndex = originalState.activeTests.findIndex(
                //   (t) => t.id === test.id,
                // );
                // if (originalIndex !== -1) {
                //   activeTests.splice(originalIndex, 0, test);
                // } else {
                //   activeTests.push(test);
                // }
                activeTests.push(test);
              }
            }
          }

          return { ...sample, activeTests, inactiveTests };
        }
        return sample;
      });

      return { ...prev, inactiveTestList };
    });

    // setJsonChangeList((prev) => {
    //   let activateTest = [...prev.activateTest];
    //   let deactivateTest = [...prev.deactivateTest];

    //   const originalState = testActivationData.inactiveTestList.find(
    //     (sample) => sample.sampleType.id === sampleTypeId,
    //   );

    //   const isOriginallyInactive = originalState.inactiveTests.some(
    //     (t) => t.id === test.id,
    //   );

    //   if (isChecked === false) {
    //     if (!isOriginallyInactive) {
    //       if (!deactivateTest.some((item) => item.id === test.id)) {
    //         deactivateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   } else {
    //     if (isOriginallyInactive) {
    //       if (!activateTest.some((item) => item.id === test.id)) {
    //         activateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   }

    //   return { activateTest, deactivateTest };
    // });
  };

  const handleInactiveTestListCheckboxChangeInactiveTests = (
    test,
    sampleTypeId,
    isChecked,
  ) => {
    setChangedTestActivationData((prev) => {
      let inactiveTestList = [...prev.inactiveTestList];
      let activeTestList = [...prev.activeTestList];

      let updatedSample = null;

      inactiveTestList = inactiveTestList.map((sample) => {
        if (sample.sampleType.id === sampleTypeId) {
          let activeTests = [...sample.activeTests];
          let inactiveTests = [...sample.inactiveTests];

          const originalState = testActivationData.inactiveTestList.find(
            (sample) => sample.sampleType.id === sampleTypeId,
          );

          if (inactiveTests.some((t) => t.id === test.id)) {
            if (isChecked) {
              inactiveTests = inactiveTests.filter(
                (item) => item.id !== test.id,
              );
              if (!activeTests.some((item) => item.id === test.id)) {
                // const originalIndex = originalState.activeTests.findIndex(
                //   (t) => t.id === test.id,
                // );
                // if (originalIndex !== -1) {
                //   activeTests.splice(originalIndex, 0, test);
                // } else {
                //   activeTests.push(test);
                // }
                activeTests.push(test);
              }

              if (activeTests.length > 0) {
                updatedSample = {
                  sampleType: sample.sampleType,
                  activeTests,
                  inactiveTests,
                };
              }
            } else {
              activeTests = activeTests.filter((item) => item.id !== test.id);
              if (!inactiveTests.some((item) => item.id === test.id)) {
                // const originalIndex = originalState.inactiveTests.findIndex(
                //   (t) => t.id === test.id,
                // );
                // if (originalIndex !== -1) {
                //   inactiveTests.splice(originalIndex, 0, test);
                // } else {
                //   inactiveTests.push(test);
                // }
                inactiveTests.push(test);
              }
            }
          }

          return { ...sample, activeTests, inactiveTests };
        }
        return sample;
      });

      inactiveTestList = inactiveTestList.filter(
        (sample) => sample.sampleType.id !== sampleTypeId,
      );
      if (updatedSample) {
        activeTestList.push(updatedSample);
      }

      return { ...prev, inactiveTestList, activeTestList };
    });

    // setJsonChangeList((prev) => {
    //   let activateTest = [...prev.activateTest];
    //   let deactivateTest = [...prev.deactivateTest];

    //   const originalState = testActivationData.inactiveTestList.find(
    //     (sample) => sample.sampleType.id === sampleTypeId,
    //   );

    //   const isOriginallyInactive = originalState.inactiveTests.some(
    //     (t) => t.id === test.id,
    //   );

    //   if (isChecked === false) {
    //     if (!isOriginallyInactive) {
    //       if (!deactivateTest.some((item) => item.id === test.id)) {
    //         deactivateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   } else {
    //     if (isOriginallyInactive) {
    //       if (!activateTest.some((item) => item.id === test.id)) {
    //         activateTest.push({ id: test.id });
    //       }
    //     } else {
    //       activateTest = activateTest.filter((item) => item.id !== test.id);
    //       deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
    //     }
    //   }

    //   return { activateTest, deactivateTest };
    // });
  };

  function testActivationPostCall() {
    setIsLoading(true);
    postToOpenElisServerJsonResponse(
      `/rest/TestOrderability`,
      JSON.stringify({
        jsonChangeList: JSON.stringify({
          activateSample: JSON.stringify(jsonChangeList.activateSample),
          deactivateSample: JSON.stringify(jsonChangeList.deactivateSample),
          activateTest: JSON.stringify(jsonChangeList.activateTest),
          deactivateTest: JSON.stringify(jsonChangeList.deactivateTest),
        }),
      }),
      (res) => testActivationPostCallback(res),
    );
  }

  function testActivationPostCallback(res) {
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
    getFromOpenElisServer(`/rest/TestActivation`, (res) => {
      handleTestActivationData(res);
    });
    return () => {
      componentMounted.current = false;
      setIsLoading(false);
    };
  }, []);

  // useEffect(() => {
  //   if (changedTestActivationData && testActivationData) {
  //     const allActiveSampleType = [
  //       ...changedTestActivationData.activeTestList.array.forEach((sample) => {
  //         sample.sampleType.id;
  //       }),
  //       ...testActivationData.activeTestList.array.forEach((sample) => {
  //         sample.sampleType.id;
  //       }),
  //     ];

  //     //{\"id\":+31,+\"activated\":+true,+\"sortOrder\":+0},+{\"id\":+30,+\"activated\":+true,+\"sortOrder\":+1},+{\"id\":+32,+\"activated\":+true,+\"sortOrder\":+2},+{\"id\":+2,+\"activated\":+false,+\"sortOrder\":+3},+{\"id\":+3,+\"activated\":+false,+\"sortOrder\":+4},+{\"id\":+1,+\"activated\":+false,+\"sortOrder\":+5},

  //     if (
  //       changedTestActivationData.activeTestList !==
  //       testActivationData.activeTestList
  //     ) {
  //       setJsonChangeList((prev) => ({
  //         ...prev,
  //         activateSample: changedTestActivationData.activeTestList.filter(
  //           (sample) =>
  //             !testActivationData.activeTestList.some(
  //               (item) => item.sampleType.id === sample.sampleType.id,
  //             ),
  //         ),
  //         deactivateSample: changedTestActivationData.inactiveTestList.filter(
  //           (sample) =>
  //             !testActivationData.inactiveTestList.some(
  //               (item) => item.sampleType.id === sample.sampleType.id,
  //             ),
  //         ),
  //       }));
  //     } else if (
  //       changedTestActivationData.inactiveTestList !==
  //       testActivationData.inactiveTestList
  //     ) {
  //       setJsonChangeList((prev) => ({
  //         ...prev,
  //         activateSample: changedTestActivationData.activeTestList.filter(
  //           (sample) =>
  //             !testActivationData.activeTestList.some(
  //               (item) => item.sampleType.id === sample.sampleType.id,
  //             ),
  //         ),
  //         deactivateSample: changedTestActivationData.inactiveTestList.filter(
  //           (sample) =>
  //             !testActivationData.inactiveTestList.some(
  //               (item) => item.sampleType.id === sample.sampleType.id,
  //             ),
  //         ),
  //       }));
  //     }
  //   }
  // }, [changedTestActivationData, testActivationData]);

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
                  <FormattedMessage id="label.testActivate" />
                </Heading>
              </Section>
            </Column>
          </Grid>
          <br />
          <hr />
          <br />
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Section>
                <Section>
                  <Section>
                    <Section>
                      <Heading>
                        <FormattedMessage id="instructions.test.activation" />
                      </Heading>
                    </Section>
                  </Section>
                </Section>
              </Section>
            </Column>
          </Grid>
          <br />
          <hr />
          <br />
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Button
                disabled={
                  jsonChangeList?.activateTest?.length === 0 &&
                  jsonChangeList?.deactivateTest?.length === 0 &&
                  jsonChangeList?.activateSample?.length === 0 &&
                  jsonChangeList?.deactivateSample?.length === 0
                }
                onClick={() => {
                  setIsConfirmModalOpen(true);
                }}
                type="button"
              >
                <FormattedMessage id="label.button.submit" />
              </Button>{" "}
              <Button
                onClick={() => window.location.assign("/admin#TestActivation")}
                kind="tertiary"
                type="button"
              >
                <FormattedMessage id="label.button.cancel" />
              </Button>
            </Column>
          </Grid>
          <br />
          <hr />
          <br />
          {changedTestActivationData?.activeTestList &&
          changedTestActivationData?.activeTestList?.length > 0 ? (
            <Grid fullWidth={true}>
              {changedTestActivationData?.activeTestList?.map((sample) => (
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
                  {sample.activeTests.map((test) => (
                    <Column
                      lg={4}
                      md={4}
                      sm={4}
                      key={`${sample.sampleType.id}-${test.id}`}
                    >
                      <Checkbox
                        id={`${sample.sampleType.id}-${test.id}`}
                        labelText={test.value}
                        checked={true}
                        onChange={(_, { checked }) => {
                          handleActiveTestListCheckboxChangeActiveTests(
                            test,
                            sample.sampleType.id,
                            checked,
                          );
                        }}
                      />
                    </Column>
                  ))}
                  {sample.inactiveTests.map((test) => (
                    <Column
                      lg={4}
                      md={4}
                      sm={4}
                      key={`${sample.sampleType.id}-${test.id}`}
                    >
                      <Checkbox
                        id={`${sample.sampleType.id}-${test.id}`}
                        labelText={test.value}
                        checked={false}
                        onChange={(_, { checked }) => {
                          handleActiveTestListCheckboxChangeInactiveTests(
                            test,
                            sample.sampleType.id,
                            checked,
                          );
                        }}
                      />
                    </Column>
                  ))}
                </>
              ))}
            </Grid>
          ) : (
            <></>
          )}
          <br />
          <hr />
          <br />
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Section>
                <Section>
                  <Heading>Inactive Sample Types</Heading>
                  {/* TODO : change this to formated message */}
                </Section>
              </Section>
            </Column>
          </Grid>
          <br />
          <hr />
          <br />
          {changedTestActivationData?.inactiveTestList &&
          changedTestActivationData?.inactiveTestList?.length > 0 ? (
            <Grid fullWidth={true}>
              {changedTestActivationData.inactiveTestList.map((sample) => (
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
                  {sample.activeTests.map((test) => (
                    <Column
                      lg={4}
                      md={4}
                      sm={4}
                      key={`${sample.sampleType.id}-${test.id}`}
                    >
                      <Checkbox
                        id={`${sample.sampleType.id}-${test.id}`}
                        labelText={test.value}
                        checked={true}
                        onChange={(_, { checked }) => {
                          handleInactiveTestListCheckboxChangeActiveTests(
                            test,
                            sample.sampleType.id,
                            checked,
                          );
                        }}
                      />
                    </Column>
                  ))}
                  {sample.inactiveTests.map((test) => (
                    <Column
                      lg={4}
                      md={4}
                      sm={4}
                      key={`${sample.sampleType.id}-${test.id}`}
                    >
                      <Checkbox
                        id={`${sample.sampleType.id}-${test.id}`}
                        labelText={test.value}
                        checked={false}
                        onChange={(_, { checked }) => {
                          handleInactiveTestListCheckboxChangeInactiveTests(
                            test,
                            sample.sampleType.id,
                            checked,
                          );
                        }}
                      />
                    </Column>
                  ))}
                </>
              ))}
            </Grid>
          ) : (
            <></>
          )}
          <br />
          <hr />
          <br />
          <Grid fullWidth={true}>
            <Column lg={16} md={8} sm={4}>
              <Button
                disabled={
                  jsonChangeList?.activateTest?.length === 0 &&
                  jsonChangeList?.deactivateTest?.length === 0 &&
                  jsonChangeList?.activateSample?.length === 0 &&
                  jsonChangeList?.deactivateSample?.length === 0
                }
                onClick={() => {
                  setIsConfirmModalOpen(true);
                }}
                type="button"
              >
                <FormattedMessage id="label.button.submit" />
              </Button>{" "}
              <Button
                onClick={() => window.location.assign("/admin#TestActivation")}
                kind="tertiary"
                type="button"
              >
                <FormattedMessage id="label.button.cancel" />
              </Button>
            </Column>
          </Grid>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <SortableTestList
            sampleType="Serum"
            tests={jsonChangeList.activateTest}
            onSort={(updatedTests) =>
              setJsonChangeList((prev) => ({
                ...prev,
                activateTest: updatedTests,
              }))
            }
          />
          <br />
          <SortableSampleTypeList
            tests={jsonChangeList.activateSample}
            onSort={(updatedSamples) =>
              setJsonChangeList((prev) => ({
                ...prev,
                activateSample: updatedSamples,
              }))
            }
          />
        </div>
        <button
          onClick={() => {
            console.log(jsonChangeList);
          }}
        >
          jsonChangeList
        </button>
        <button
          onClick={() => {
            console.log(changedTestActivationData);
          }}
        >
          changedTestActivationData
        </button>
      </div>

      <Modal
        open={isConfirmModalOpen}
        size="md"
        modalHeading={<FormattedMessage id="label.test.order.confirm" />}
        primaryButtonText={<FormattedMessage id="column.name.accept" />}
        secondaryButtonText={<FormattedMessage id="back.action.button" />}
        onRequestSubmit={() => {
          setIsConfirmModalOpen(false);
          testActivationPostCall();
        }}
        onRequestClose={() => {
          setIsConfirmModalOpen(false);
        }}
      >
        <Grid fullWidth={true}>
          <Column lg={16} md={8} sm={4}></Column>
        </Grid>
      </Modal>
    </>
  );
}

export default injectIntl(TestActivation);
