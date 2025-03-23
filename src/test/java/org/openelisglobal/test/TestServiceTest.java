package org.openelisglobal.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.common.util.ConfigurationProperties;
import org.openelisglobal.test.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;

public class TestServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private TestService testService;

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/test.xml");
    }

    @Test
    public void getAllTests_ShouldReturnAllTests() {
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getAllTests(false);
        assertEquals("Blood Test", tests.get(0).getDescription());
        assertEquals("Urine Test", tests.get(1).getDescription());
    }

    @Test
    public void getData_shouldReturnDataGivenTest() {
        org.openelisglobal.test.valueholder.Test test1 = testService.get("1");
        testService.getData(test1);
        assertEquals("Blood Test", test1.getDescription());
        assertEquals("therapy", test1.getMethod().getMethodName());

        org.openelisglobal.test.valueholder.Test test2 = testService.get("2");
        testService.getData(test2);
        assertEquals("Urine Test", test2.getDescription());
        assertEquals("imagining", test2.getMethod().getMethodName());
    }

    @Test
    public void getActiveTestById_ShouldReturnActiveTest() {
        org.openelisglobal.test.valueholder.Test test = testService.getActiveTestById(1);
        assertEquals("Y", test.getIsActive());
    }

    @Test
    public void getTotalTestCount_ShouldReturnTotalTestCount() {
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getAll();
        int totalTestCount = testService.getTotalTestCount();
        assertEquals(tests.size(), totalTestCount);
    }

    @Test
    public void getAllActiveTests_ShouldReturnAllActiveTests() {
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getAllActiveTests(false);
        tests.forEach(test -> assertEquals("Y", test.getIsActive()));
    }

    @Test
    public void getAllActiveTests_ShouldReturnAllActiveTestsFullySetup() {
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getAllActiveTests(false);
        tests.forEach(test -> assertEquals("Y", test.getIsActive()));
    }

    @Test
    public void getTestsByTestSectionIds_ShouldReturnTestsByTestSectionIds() {
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getTestsByTestSectionIds(List.of(1, 2));
        assertEquals(2, tests.size());
    }

    @Test
    public void getTestsByTestSectionId_shouldReturnTestGivenTestSectionId() {
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getTestsByTestSectionId("1");
        assertEquals(1, tests.size());
        assertEquals("Blood Test", tests.get(0).getDescription());
        List<org.openelisglobal.test.valueholder.Test> tests2 = testService.getTestsByTestSectionId("2");
        assertEquals(1, tests2.size());
        assertEquals("Urine Test", tests2.get(0).getDescription());
    }

    @Test
    public void deactivateAllTests_ShouldDeactivateAllTests() {
        testService.deactivateAllTests();
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getAll();
        tests.forEach(test -> assertEquals("N", test.getIsActive()));
    }

    @Test
    public void getPageOfTests_shouldReturnPageOfTests() {
        List<org.openelisglobal.test.valueholder.Test> tests = testService.getPageOfTests(1);
        int expectedPages = Integer
                .parseInt(ConfigurationProperties.getInstance().getPropertyValue("page.defaultPageSize"));
        assertTrue(tests.size() <= expectedPages);

    }

    @Test
    public void getTestByGUID_shouldReturnTestGivenGUID() {
        org.openelisglobal.test.valueholder.Test test = testService.getTestByGUID("abc-123");
        assertEquals("Blood Test", test.getDescription());
    }

    @Test
    public void getTestById_shouldReturnTestGivenId() {
        org.openelisglobal.test.valueholder.Test test2 = testService.getTestById("1");
        assertEquals("Blood Test", test2.getDescription());
        org.openelisglobal.test.valueholder.Test test = testService.getTestById("2");
        assertEquals("Urine Test", test.getDescription());

    }

}
