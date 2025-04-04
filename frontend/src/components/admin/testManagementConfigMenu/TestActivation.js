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
  const [sampleTypeIdToListMapTests, setSampleTypeIdToListMapTests] = useState(
    [],
  );
  const [testArrangementArray, setTestArrangementArray] = useState([]);
  const [sampleTypeArrangementActivate, setSampleTypeArrangementActivate] =
    useState(false);
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
              setSampleTypeArrangementActivate(true);
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

    setJsonChangeList((prev) => {
      let activateTest = [...prev.activateTest];
      let deactivateTest = [...prev.deactivateTest];
      let activateSample = Array.isArray(prev.activateSample)
        ? [...prev.activateSample]
        : [];
      let deactivateSample = Array.isArray(prev.deactivateSample)
        ? [...prev.deactivateSample]
        : [];

      const originalState = testActivationData.activeTestList.find(
        (sample) => sample.sampleType.id === sampleTypeId,
      );

      const isOriginallyActive = originalState?.activeTests?.some(
        (t) => t.id === test.id,
      );

      if (isChecked === true) {
        if (!isOriginallyActive || isOriginallyActive === undefined) {
          if (!activateTest.some((item) => item.id === test.id)) {
            // activateTest.push({
            //   id: test.id,
            //   // activated: true,
            //   // sortOrder : index
            // });
            handleActiveTestsOnChangeSetJsonChangeList(test, sampleTypeId);
          }
          if (!activateSample.some((item) => item.id === sampleTypeId)) {
            // activateSample.push({ id: sampleTypeId });
            handleActiveSampleOnChangeSetJsonChangeList(sampleTypeId);
          } else {
            activateSample = activateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      } else {
        if (isOriginallyActive) {
          if (!deactivateTest.some((item) => item.id === test.id)) {
            deactivateTest.push({ id: test.id });
          }
          if (!deactivateSample.some((item) => item.id === sampleTypeId)) {
            deactivateSample.push({ id: sampleTypeId });
          } else {
            deactivateSample = deactivateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      }

      return {
        ...prev,
        activateTest,
        deactivateTest,
        activateSample,
        deactivateSample,
      };
    });
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

    setJsonChangeList((prev) => {
      let activateTest = [...prev.activateTest];
      let deactivateTest = [...prev.deactivateTest];
      let activateSample = Array.isArray(prev.activateSample)
        ? [...prev.activateSample]
        : [];
      let deactivateSample = Array.isArray(prev.deactivateSample)
        ? [...prev.deactivateSample]
        : [];

      const originalState = testActivationData.activeTestList.find(
        (sample) => sample.sampleType.id === sampleTypeId,
      );

      const isOriginallyActive = originalState?.activeTests?.some(
        (t) => t.id === test.id,
      );

      if (isChecked === true) {
        if (!isOriginallyActive || isOriginallyActive === undefined) {
          if (!activateTest.some((item) => item.id === test.id)) {
            // activateTest.push({
            //   id: test.id,
            //   // activated: true,
            //   // sortOrder : index
            // });
            handleActiveTestsOnChangeSetJsonChangeList(test, sampleTypeId);
          }
          if (!activateSample.some((item) => item.id === sampleTypeId)) {
            // activateSample.push({ id: sampleTypeId });
            handleActiveSampleOnChangeSetJsonChangeList(sampleTypeId);
          } else {
            activateSample = activateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      } else {
        if (isOriginallyActive) {
          if (!deactivateTest.some((item) => item.id === test.id)) {
            deactivateTest.push({ id: test.id });
          }
          if (!deactivateSample.some((item) => item.id === sampleTypeId)) {
            deactivateSample.push({ id: sampleTypeId });
          } else {
            deactivateSample = deactivateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      }

      return {
        ...prev,
        activateTest,
        deactivateTest,
        activateSample,
        deactivateSample,
      };
    });
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

    setJsonChangeList((prev) => {
      let activateTest = [...prev.activateTest];
      let deactivateTest = [...prev.deactivateTest];
      let activateSample = Array.isArray(prev.activateSample)
        ? [...prev.activateSample]
        : [];
      let deactivateSample = Array.isArray(prev.deactivateSample)
        ? [...prev.deactivateSample]
        : [];

      const originalState = testActivationData.inactiveTestList.find(
        (sample) => sample.sampleType.id === sampleTypeId,
      );

      const isOriginallyInactive = originalState?.inactiveTests?.some(
        (t) => t.id === test.id,
      );

      if (isChecked === false) {
        if (!isOriginallyInactive || isOriginallyInactive === undefined) {
          if (!deactivateTest.some((item) => item.id === test.id)) {
            deactivateTest.push({ id: test.id });
          }
          if (!deactivateSample.some((item) => item.id === sampleTypeId)) {
            deactivateSample.push({ id: sampleTypeId });
          } else {
            deactivateSample = deactivateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      } else {
        if (isOriginallyInactive) {
          if (!activateTest.some((item) => item.id === test.id)) {
            // activateTest.push({
            //   id: test.id,
            //   // activated: true,
            //   // sortOrder : index
            // });
            handleActiveTestsOnChangeSetJsonChangeList(test, sampleTypeId);
          }
          if (!activateSample.some((item) => item.id === sampleTypeId)) {
            // activateSample.push({ id: sampleTypeId });
            handleActiveSampleOnChangeSetJsonChangeList(sampleTypeId);
          } else {
            activateSample = activateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      }

      return {
        ...prev,
        activateTest,
        deactivateTest,
        activateSample,
        deactivateSample,
      };
    });
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
                setSampleTypeArrangementActivate(true);
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

    setJsonChangeList((prev) => {
      let activateTest = [...prev.activateTest];
      let deactivateTest = [...prev.deactivateTest];
      let activateSample = Array.isArray(prev.activateSample)
        ? [...prev.activateSample]
        : [];
      let deactivateSample = Array.isArray(prev.deactivateSample)
        ? [...prev.deactivateSample]
        : [];

      const originalState = testActivationData.inactiveTestList.find(
        (sample) => sample.sampleType.id === sampleTypeId,
      );

      const isOriginallyInactive = originalState?.inactiveTests?.some(
        (t) => t.id === test.id,
      );

      if (isChecked === false) {
        if (!isOriginallyInactive || isOriginallyInactive === undefined) {
          if (!deactivateTest.some((item) => item.id === test.id)) {
            deactivateTest.push({ id: test.id });
          }
          if (!deactivateSample.some((item) => item.id === sampleTypeId)) {
            deactivateSample.push({ id: sampleTypeId });
          } else {
            deactivateSample = deactivateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      } else {
        if (isOriginallyInactive) {
          if (!activateTest.some((item) => item.id === test.id)) {
            // activateTest.push({
            //   id: test.id,
            //   // activated: true,
            //   // sortOrder : index
            // });
            handleActiveTestsOnChangeSetJsonChangeList(test, sampleTypeId);
          }
          if (!activateSample.some((item) => item.id === sampleTypeId)) {
            // activateSample.push({ id: sampleTypeId });
            handleActiveSampleOnChangeSetJsonChangeList(sampleTypeId);
          } else {
            activateSample = activateSample.filter(
              (item) => item.id !== sampleTypeId,
            );
          }
        } else {
          activateTest = activateTest.filter((item) => item.id !== test.id);
          deactivateTest = deactivateTest.filter((item) => item.id !== test.id);
        }
      }

      return {
        ...prev,
        activateTest,
        deactivateTest,
        activateSample,
        deactivateSample,
      };
    });
  };

  function testActivationPostCall() {
    setIsLoading(true);
    postToOpenElisServerJsonResponse(
      `/rest/TestActivation`,
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

  useEffect(() => {
    if (testActivationData) {
      let sortOrder = 0;

      let sampleTypeIdList = new Set();

      testActivationData?.activeTestList?.forEach((sample) =>
        sampleTypeIdList.add(Number(sample.sampleType.id)),
      );

      testActivationData?.inactiveTestList?.forEach((sample) =>
        sampleTypeIdList.add(Number(sample.sampleType.id)),
      );

      const activateSample = Array.from(sampleTypeIdList).map((id) => ({
        id,
        activated: false,
        sortOrder: sortOrder++,
      }));

      setJsonChangeList((prev) => ({
        ...prev,
        activateSample,
      }));
    }
  }, [testActivationData]);

  useEffect(() => {
    if (testActivationData && sampleTypeIdToListMapTests?.length > 0) {
      let sortOrder = 0;

      let testArrangementArrayGroups = [];

      // from the sampleTypeIdToListMapTests has ids where i need to find all sampleTypes { has : tests } of the sampleTypeIdToListMapTests.ids [] i want all the tests weather it is in activeTest and inactiveTest doesn't matter mapp the {id : ids of the test, activated : false , sortOrder : sortOrder++};

      // there can be multiple ids so from the multiple sampleTypes you need to collect testIds and push it to activateTest

      const sampleTypeIds = new Set(
        sampleTypeIdToListMapTests.map((item) => Number(item.id)),
      );

      // Iterate over testActivationData (both active and inactive tests)
      const allTestLists = [
        ...(testActivationData?.activeTestList || []).filter(
          (st) => st?.sampleType?.id,
        ),
        ...(testActivationData?.inactiveTestList || []).filter(
          (st) => st?.sampleType?.id,
        ),
      ];

      allTestLists.forEach((sampleType) => {
        const sampleTypeId = sampleType?.sampleType?.id;

        if (sampleTypeIds.has(Number(sampleTypeId))) {
          const allTests = [
            ...(sampleType?.activeTests || []),
            ...(sampleType?.inactiveTests || []),
          ];

          const testIdsObject = allTests.map((test) => ({
            id: test.id,
            activated: false,
            sortOrder: sortOrder++,
          }));

          testArrangementArrayGroups.push(testIdsObject);
        }
      });

      setTestArrangementArray(testArrangementArrayGroups);
    }
  }, [testActivationData, sampleTypeIdToListMapTests]);

  const handleActiveSampleOnChangeSetJsonChangeList = (sampleTypeId) => {
    setJsonChangeList((prev) => {
      const activateSample = prev.activateSample
        ? [...prev.activateSample]
        : [];

      const updatedActivateSample = activateSample.map((s) =>
        s.id === sampleTypeId ? { ...s, activated: true } : s,
      );

      return {
        ...prev,
        activateSample: updatedActivateSample,
      };
    });
  };

  const handleActiveTestsOnChangeSetJsonChangeList = (test, sampleTypeId) => {
    // test.id should be string

    // from the sampleTypeId get the sampleType object and map all the data setJsonChangeList.activeTest in same formate

    //   "activateTest": "[{\"id\":+5,+\"activated\":+false,+\"sortOrder\":+0},+{\"id\":+42,+\"activated\":+false,+\"sortOrder\":+1},+{\"id\":+4,+\"activated\":+false,+\"sortOrder\":+2},+{\"id\":+307,+\"activated\":+false,+\"sortOrder\":+3},+{\"id\":+303,+\"activated\":+false,+\"sortOrder\":+4},+{\"id\":+57,+\"activated\":+false,+\"sortOrder\":+5},+{\"id\":+2,+\"activated\":+false,+\"sortOrder\":+6},+{\"id\":+318,+\"activated\":+true,+\"sortOrder\":+7},+{\"id\":+302,+\"activated\":+true,+\"sortOrder\":+0}]",

    // first check if the sampleTypeId is present in testActivationData.activeTestList then map all the test with activeTest and inactiveTest with correct sortOrder and keep the activated as false and for the test (test.id) this fucntion will mark it activated : true only.

    setSampleTypeIdToListMapTests((prev) => {
      return [...prev, { id: sampleTypeId }];
    });

    setTestArrangementArray((prev) => {
      // itrrate over testManagemnetArray which has data like [[{},{}],[{}]] and find the test.id = from the arrays inside each and each array which has objects inside and if test.id matcher the id inside of any object then make it activated : true and return the array.
      const updatedTestArrangementArray = prev.map((arr) =>
        arr.map((t) => {
          if (t.id === `${test.id}` || t.id === test.id) {
            return { ...t, activated: true };
          }
          return t;
        }),
      );
      return updatedTestArrangementArray;
    });
  };

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
                onClick={() => window.location.reload()}
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
                onClick={() => window.location.reload()}
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
        <button
          onClick={() => {
            setSampleTypeIdToListMapTests([{ id: 3 }, { id: 4 }]);
          }}
        >
          push
        </button>
        <button
          onClick={() => {
            console.log(testArrangementArray);
          }}
        >
          testArrangementArray
        </button>
        <button
          onClick={() => {
            handleActiveTestsOnChangeSetJsonChangeList({ id: 53 }, 3);
          }}
        >
          handleActiveTestsOnChangeSetJsonChangeList
        </button>
        <button
          onClick={() => {
            handleActiveSampleOnChangeSetJsonChangeList(3);
          }}
        >
          handleActiveSampleOnChangeSetJsonChangeList
        </button>
      </div>

      <Modal
        open={isConfirmModalOpen}
        size="lg"
        modalHeading={<FormattedMessage id="label.test.order.confirm" />}
        primaryButtonText={<FormattedMessage id="column.name.accept" />}
        secondaryButtonText={<FormattedMessage id="back.action.button" />}
        onRequestSubmit={() => {
          setIsConfirmModalOpen(false);
          testActivationPostCall();
        }}
        onRequestClose={() => {
          setIsConfirmModalOpen(false);
          window.location.reload();
        }}
        preventCloseOnClickOutside={true}
        shouldSubmitOnEnter={true}
      >
        <Grid fullWidth={true}>
          <Column lg={16} md={8} sm={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {Array.isArray(testArrangementArray) &&
                testArrangementArray.map((testsArray, index) => (
                  <SortableTestList
                    key={index}
                    sampleType={`Sample Type ${index + 1}`}
                    tests={() => {
                      const testIdsWithName = [];
                      testsArray?.forEach((t) => {
                        testActivationData?.activeTestList?.forEach(
                          (sample) => {
                            sample.activeTests.forEach((activeTest) => {
                              if (activeTest.id === t.id) {
                                testIdsWithName.push({
                                  id: activeTest.id,
                                  value: activeTest.value,
                                });
                              }
                            });
                            sample.inactiveTests.forEach((inactiveTest) => {
                              if (inactiveTest.id === t.id) {
                                testIdsWithName.push({
                                  id: inactiveTest.id,
                                  value: inactiveTest.value,
                                });
                              }
                            });
                          },
                        );
                        testActivationData?.inactiveTestList?.forEach(
                          (sample) => {
                            sample.activeTests.forEach((activeTest) => {
                              if (activeTest.id === t.id) {
                                testIdsWithName.push({
                                  id: activeTest.id,
                                  value: activeTest.value,
                                });
                              }
                            });
                            sample.inactiveTests.forEach((inactiveTest) => {
                              if (inactiveTest.id === t.id) {
                                testIdsWithName.push({
                                  id: inactiveTest.id,
                                  value: inactiveTest.value,
                                });
                              }
                            });
                          },
                        );
                      });

                      return testIdsWithName;
                    }}
                    onSort={(updatedTests) => {
                      setTestArrangementArray((prev) => {
                        const newArrangement = [...prev];
                        newArrangement[index] = updatedTests;
                        return newArrangement;
                      });
                    }}
                  />
                ))}
            </div>
          </Column>
        </Grid>
        <br />
        <Grid fullWidth={true}>
          <Column lg={16} md={8} sm={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {sampleTypeArrangementActivate &&
                testActivationData &&
                jsonChangeList &&
                jsonChangeList?.activateSample?.length > 0 && (
                  <SortableSampleTypeList
                    tests={() => {
                      const allSampleTypes = [];
                      testActivationData?.activeTestList?.forEach((sample) => {
                        allSampleTypes.push(sample.sampleType);
                      });
                      testActivationData?.inactiveTestList?.forEach(
                        (sample) => {
                          allSampleTypes.push(sample.sampleType);
                        },
                      );
                      return allSampleTypes;
                    }}
                    testSendout={jsonChangeList?.activateSample}
                    onSort={(updatedSamples) =>
                      setJsonChangeList((prev) => ({
                        ...prev,
                        activateSample: updatedSamples,
                      }))
                    }
                  />
                )}
            </div>
          </Column>
        </Grid>
      </Modal>
    </>
  );
}

export default injectIntl(TestActivation);

// fix post sendout
// fix sortable Component to Activated : true
