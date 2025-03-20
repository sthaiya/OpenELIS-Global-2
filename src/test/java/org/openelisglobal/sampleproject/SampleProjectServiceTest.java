package org.openelisglobal.sampleproject;

import static org.junit.Assert.assertEquals;

import java.sql.Date;
import java.util.List;
import org.hibernate.Hibernate;
import org.junit.Assert;
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

        List<SampleProject> allSampleProjects = sampleProjectService.getAll();
        for (SampleProject sp : allSampleProjects) {
            Hibernate.initialize(sp.getProject()); // Load Project entity
            Hibernate.initialize(sp.getSample()); // Load Sample entity

            // Debugging logs
            System.out.println("SampleProject ID: " + sp.getId());
            System.out.println("Project ID: " + (sp.getProject() != null ? sp.getProject().getId() : "NULL"));
            System.out.println("Sample ID: " + (sp.getSample() != null ? sp.getSample().getId() : "NULL"));
        }
    }

    @Test
    public void verifyTestData() {
        List<SampleProject> sampleProjects = sampleProjectService.getAll();
        System.out.println("SampleProjects in DB: " + sampleProjects.size());
        sampleProjects.forEach(sampleProject -> System.out.println(sampleProject.getId() + " - "
                + sampleProject.getProject().getProjectName() + " - " + sampleProject.getSample().getId()));
    }

    @Test
    public void getSampleProjectBySampleId_shouldReturnCorrectSampleProject() {
        SampleProject sampleProject = sampleProjectService.getSampleProjectBySampleId("1");

        Assert.assertNotNull(sampleProject);
        assertEquals("1", sampleProject.getSample().getId());
        assertEquals("Test Project", sampleProject.getProject().getProjectName());
    }

    @Test
    public void getSampleProjectsByProjId_shouldReturnCorrectSampleProjects() {
        List<SampleProject> sampleProjects = sampleProjectService.getSampleProjectsByProjId("1");

        // Debug: Print the size of the returned list
        System.out.println("Number of SampleProjects returned: " + sampleProjects.size());

        // Debug: Print details of each SampleProject
        for (SampleProject sampleProject : sampleProjects) {
            System.out.println("SampleProject ID: " + sampleProject.getId());
            System.out.println("Project ID: " + sampleProject.getProject().getId());
            System.out.println("Project Name: " + sampleProject.getProject().getProjectName());
        }

        Assert.assertNotNull("SampleProjects list should not be null", sampleProjects);
        assertEquals("Expected 1 SampleProject for project ID 1", 1, sampleProjects.size());

        SampleProject sampleProject = sampleProjects.get(0);
        Assert.assertNotNull("SampleProject should not be null", sampleProject);
        assertEquals("Project ID should be 1", "1", sampleProject.getProject().getId());
        assertEquals("Project name should be 'Test Project'", "Test Project",
                sampleProject.getProject().getProjectName());
    }

    @Test
    public void getByOrganizationProjectAndReceivedOnRange_shouldReturnCorrectSampleProjects() {
        // Debug: Print all SampleProject records before filtering
        List<SampleProject> allSampleProjects = sampleProjectService.getAll(); // Fetch all SampleProject records

        System.out.println("Total SampleProjects in DB before filtering: " + allSampleProjects.size());

        for (SampleProject sp : allSampleProjects) {
            System.out.println("SampleProject ID: " + sp.getId());
            System.out.println("Project ID: " + sp.getProject().getId());
            System.out.println("Project Name: " + sp.getProject().getProjectName());
            System.out.println("Sample ID: " + sp.getSample().getId());
            System.out.println("Received Date: " + sp.getSample().getReceivedDate());
        }

        Date lowDate = Date.valueOf("2023-01-01");
        Date highDate = Date.valueOf("2023-12-31");
        String organizationId = "1";

        // Debug: Print query parameters
        System.out.println("Query Parameters:");
        System.out.println("Project Name: Test Project");
        System.out.println("Organization ID: " + organizationId);
        System.out.println("Date Low: " + lowDate);
        System.out.println("Date High: " + highDate);

        List<SampleProject> sampleProjects = sampleProjectService
                .getByOrganizationProjectAndReceivedOnRange(organizationId, "Test Project", lowDate, highDate);

        // Debug: Print the number of results returned
        System.out.println("Number of SampleProjects returned: " + sampleProjects.size());

        for (SampleProject sampleProject : sampleProjects) {
            System.out.println("SampleProject ID: " + sampleProject.getId());
            System.out.println("Project ID: " + sampleProject.getProject().getId());
            System.out.println("Project Name: " + sampleProject.getProject().getProjectName());
            System.out.println("Sample ID: " + sampleProject.getSample().getId());
        }

        Assert.assertNotNull("SampleProjects list should not be null", sampleProjects);
        assertEquals("Expected 1 SampleProject for the given criteria", 1, sampleProjects.size());

        SampleProject sampleProject = sampleProjects.get(0);
        Assert.assertNotNull("SampleProject should not be null", sampleProject);
        assertEquals("Project ID should be 1", "1", sampleProject.getProject().getId());
        assertEquals("Project name should be 'Test Project'", "Test Project",
                sampleProject.getProject().getProjectName());
    }

    @Test
    public void deleteSampleProject_shouldRemoveSampleProject() {
        SampleProject sampleProject = sampleProjectService.getSampleProjectBySampleId("1");

        sampleProjectService.delete(sampleProject);

        SampleProject deletedSampleProject = sampleProjectService.getSampleProjectBySampleId("1");
        Assert.assertNull(deletedSampleProject);
    }

    @Test
    public void updateSampleProject_shouldUpdateSampleProject() {
        SampleProject sampleProject = sampleProjectService.getSampleProjectBySampleId("1");

        sampleProject.setIsPermanent("N");
        sampleProjectService.update(sampleProject);

        SampleProject updatedSampleProject = sampleProjectService.getSampleProjectBySampleId("1");
        Assert.assertNotNull(updatedSampleProject);
        assertEquals("N", updatedSampleProject.getIsPermanent());
    }

}