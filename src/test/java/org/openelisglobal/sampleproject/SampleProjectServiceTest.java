package org.openelisglobal.sampleproject;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

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

}