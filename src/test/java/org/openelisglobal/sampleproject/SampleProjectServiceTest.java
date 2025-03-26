package org.openelisglobal.sampleproject;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import jakarta.persistence.PersistenceException;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.sampleproject.service.SampleProjectService;
import org.openelisglobal.sampleproject.valueholder.SampleProject;
import org.springframework.beans.factory.annotation.Autowired;

public class SampleProjectServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private SampleProjectService sampleProjectService;

    @Before
    public void init() throws Exception {
        executeDataSetWithStateManagement("testdata/sampleproject.xml");
    }

    @Test
    public void getSampleProjectBySampleId_shouldReturnCorrectSampleProject() {
        SampleProject sampleProject = sampleProjectService.getSampleProjectBySampleId("1");

        assertNotNull(sampleProject);
        assertEquals("1", sampleProject.getSample().getId());
    }

    @Test
    public void getSampleProjectBySampleId_shouldReturnSingleSampleProject() {
        SampleProject result = sampleProjectService.getSampleProjectBySampleId("1");
        assertNotNull(result);
        assertNotNull(result.getSample());
        assertEquals("1", result.getSample().getId().toString());
        assertNotNull(result.getProject());
        assertEquals("1", result.getProject().getId().toString());
    }

    @Test
    public void getData_shouldPopulateSampleProject() {
        SampleProject emptyProject = new SampleProject();
        emptyProject.setId("1");

        sampleProjectService.getData(emptyProject);

        assertNotNull(emptyProject.getProject());
        assertEquals("1", emptyProject.getProject().getId().toString());
    }

    @Test
    public void getData_shouldHandleNonExistentId() {
        SampleProject nonExistent = new SampleProject();
        nonExistent.setId("999");

        sampleProjectService.getData(nonExistent);

        assertNull(nonExistent.getId());
    }

    @Test
    public void getSampleProjectBySampleId_shouldThrowForNullInput() {

        try {
            sampleProjectService.getSampleProjectBySampleId(null);
            fail("Expected exception not thrown");
        } catch (Exception e) {

            assertTrue(e instanceof PersistenceException || e instanceof IllegalArgumentException);
        }
    }

}
