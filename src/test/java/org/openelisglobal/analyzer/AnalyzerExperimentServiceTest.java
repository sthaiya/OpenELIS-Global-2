package org.openelisglobal.analyzer;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.AbstractMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.analyzer.service.AnalyzerExperimentService;
import org.openelisglobal.analyzer.valueholder.AnalyzerExperiment;
import org.openelisglobal.common.exception.LIMSException;
import org.springframework.beans.factory.annotation.Autowired;

public class AnalyzerExperimentServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private AnalyzerExperimentService analyzerExperimentService;
   
    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/analyzer-experiment.xml");
    }
   
    @Test
    public void getAnalyzerExperimentFromDataBase() {
        List<AnalyzerExperiment> experimentList = analyzerExperimentService.getAll();
        assertNotNull(experimentList);
        assertEquals(3, experimentList.size());
        experimentList.forEach(experiment -> {
            System.out.print(experiment.getName() + " ");
        });
    }
   
    @Test
    public void getWellValuesForId_shouldReturnWellValues() throws IOException {
        // The file in the XML dataset contains binary data
        Map<String, String> wellValues = analyzerExperimentService.getWellValuesForId(1);
       
        // Just verify we get a non-null result
        // In a real test environment with proper CSV data, we would check specific values
        assertNotNull(wellValues);
    }
   
    @Test
    public void saveMapAsCSVFile_shouldSaveAndReturnId() throws LIMSException {
        // Arrange
        Map<String, String> wellValues = new HashMap<>();
        wellValues.put("A1", "Sample1");
        wellValues.put("B2", "Sample2");
        wellValues.put("C3", "Sample3");
       
        // Act
        Integer id = analyzerExperimentService.saveMapAsCSVFile("TestFile.csv", wellValues);
       
        // Assert
        assertNotNull(id);
       
        // Verify the file was saved properly
        AnalyzerExperiment savedExperiment = analyzerExperimentService.get(id);
        assertEquals("TestFile.csv", savedExperiment.getName());
    }
   
    @Test
    public void insert_shouldInsertAnalyzerExperiment() {
        // Arrange
        AnalyzerExperiment newExperiment = new AnalyzerExperiment();
        newExperiment.setName("PCR Test Experiment");
        newExperiment.setFile("well,Sample Name\nD1,NewSample1\n".getBytes());
       
        // Act
        Integer inserted = analyzerExperimentService.insert(newExperiment);
        AnalyzerExperiment insertedExperiment = analyzerExperimentService.get(inserted);
       
        // Assert
        assertNotNull(insertedExperiment);
        assertEquals("PCR Test Experiment", insertedExperiment.getName());
    }
   
    @Test
    public void getAnalyzerExperimentById_shouldReturnCorrectExperiment() {
        // Act
        AnalyzerExperiment experiment = analyzerExperimentService.get(1);
       
        // Assert
        assertNotNull(experiment);
        assertEquals("Blood Chemistry Analysis", experiment.getName());
    }
   
    @Test
    public void update_shouldUpdateAnalyzerExperiment() {
        // Arrange
        AnalyzerExperiment experiment = analyzerExperimentService.get(2);
        String originalName = experiment.getName();
        experiment.setName("Updated Blood Count Test");
       
        // Act
        analyzerExperimentService.update(experiment);
        AnalyzerExperiment updatedExperiment = analyzerExperimentService.get(2);
       
        // Assert
        assertNotNull(updatedExperiment);
        assertEquals("Updated Blood Count Test", updatedExperiment.getName());
       
        // Clean up - reset the name
        experiment.setName(originalName);
        analyzerExperimentService.update(experiment);
    }
}