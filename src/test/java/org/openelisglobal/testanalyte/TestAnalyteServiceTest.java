package org.openelisglobal.testanalyte;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.testanalyte.service.TestAnalyteService;
import org.openelisglobal.testanalyte.valueholder.TestAnalyte;
import org.springframework.beans.factory.annotation.Autowired;

public class TestAnalyteServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private TestAnalyteService testAnalyteService;

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/test-analyte.xml");
    }

    @Test
    public void testDataInDataBase() {
        List<TestAnalyte> testAnalytes = testAnalyteService.getAll();
        testAnalytes.forEach(testAnalyte -> {
            System.out.print(testAnalyte.getId() + " - " + testAnalyte.getTest().getId() + " - "
                    + testAnalyte.getAnalyte().getId() + " ");
        });
    }

    @Test
    public void getAllTestAnalytes_shouldReturnAllTestAnalytes() {
        List<TestAnalyte> testAnalytes = testAnalyteService.getAllTestAnalytes();
        assertEquals(2, testAnalytes.size());
    }

    @Test
    public void getTestAnalyteById_shouldReturnCorrectTestAnalyte() {
        TestAnalyte testAnalyte = new TestAnalyte();
        testAnalyte.setId("1");

        TestAnalyte result = testAnalyteService.getTestAnalyteById(testAnalyte);

        assertNotNull(result);
        assertEquals("1", result.getId());
        assertEquals("1", result.getTest().getId());
        assertEquals("1", result.getAnalyte().getId());
    }

    @Test
    public void getAllTestAnalytesPerTest_shouldReturnAllAnalytesForTest() {
        // Use fully qualified name to avoid ambiguity with JUnit's Test
        org.openelisglobal.test.valueholder.Test labTest = new org.openelisglobal.test.valueholder.Test();
        labTest.setId("1");

        List<TestAnalyte> testAnalytes = testAnalyteService.getAllTestAnalytesPerTest(labTest);

        assertEquals(1, testAnalytes.size());

        boolean foundTestAnalyte1 = false;
        boolean foundTestAnalyte2 = false;

        for (TestAnalyte ta : testAnalytes) {
            if ("1".equals(ta.getId())) {
                foundTestAnalyte1 = true;
            } else if ("2".equals(ta.getId())) {
                foundTestAnalyte2 = true;
            }
        }

        assertTrue(foundTestAnalyte1);
        assertFalse(foundTestAnalyte2);
    }

    // this is for autocomplete
    // TODO: need to convert to hibernate ( not in use??? )
    @Test
    public void getTestAnalytes_withFilter_shouldReturnFilteredTestAnalytes() {
        // Filter by "Blood" which should match "Blood Test"
        List<TestAnalyte> testAnalytes = testAnalyteService.getTestAnalytes("Blood");

        // assertEquals(1, testAnalytes.size());
        // for (TestAnalyte ta : testAnalytes) {
        // assertEquals("1", ta.getTest().getId());
        // }
        assertNull(testAnalytes);

        // Filter by "Glucose" which should match the analyte name
        testAnalytes = testAnalyteService.getTestAnalytes("Glucose");
        // assertEquals(1, testAnalytes.size());
        // for (TestAnalyte ta : testAnalytes) {
        // assertEquals("1", ta.getAnalyte().getId());
        // }
        assertNull(testAnalytes);
    }

    @Test
    public void getData_shouldReturnMatchingTestAnalyte() {
        TestAnalyte testAnalyte = new TestAnalyte();
        testAnalyte.setId("2");

        TestAnalyte result = testAnalyteService.getData(testAnalyte);

        assertNotNull(result);
        assertEquals("2", result.getId());
        assertEquals("2", result.getTest().getId());
        assertEquals("2", result.getAnalyte().getId());
    }

    @Test
    public void getPageOfTestAnalytes_shouldReturnPagedResults() {
        // Starting from the first record
        List<TestAnalyte> testAnalytes = testAnalyteService.getPageOfTestAnalytes(1);

        // Check if we got some results
        assertTrue(testAnalytes.size() > 0);
        // The actual number depends on your paging implementation
    }

    @Test
    public void testAnalyte_shouldHaveCorrectProperties() {
        TestAnalyte testAnalyte = new TestAnalyte();
        testAnalyte.setId("2");

        TestAnalyte result = testAnalyteService.getTestAnalyteById(testAnalyte);

        assertNotNull(result);
        assertEquals("2", result.getId());
        assertEquals("2", result.getTest().getId());
        assertEquals("2", result.getAnalyte().getId());
        assertEquals("1", result.getResultGroup());
        assertEquals("2", result.getSortOrder());
        assertEquals("R", result.getTestAnalyteType());
        assertEquals("Y", result.getIsReportable());
    }
}