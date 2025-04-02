package org.openelisglobal.image;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.image.service.ImageService;
import org.openelisglobal.image.valueholder.Image;
import org.springframework.beans.factory.annotation.Autowired;

public class ImageServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private ImageService imageService;

    private static final String basePath = new File("src/main/webapp/static/images/").getAbsolutePath().toString();
    private static final byte[] image1 = Base64.getDecoder()
            .decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgMBAQEBBQAAAA==");
    private static final byte[] image2 = Base64.getDecoder()
            .decode("iPBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgMBAQEBBQAAAA==");

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/image.xml");
    }

    @Test
    public void getFullPreviewPath() {
        String expectedPath = basePath.replaceAll("[/\\\\]+$", "");
        String actualPath = imageService.getFullPreviewPath().replaceAll("[/\\\\]+$", "");

        assertEquals(expectedPath, actualPath);
    }

    @Test
    public void getImageByDescription() {
        Image image = imageService.getImageByDescription("headerLeftImage");
        assertTrue(Arrays.equals(image1, image.getImage()));
        assertEquals("1", image.getId());
    }

    @Test
    public void getImageNameFilePath() {
        String imageString = "headerLeftImage";
        String image = imageService.getImageNameFilePath(imageString);
        assertEquals("leftLabLogo.jpg", image);
    }

    @Test
    public void testGetImageBySiteInfoName() {
        // Test for an existing image
        Optional<Image> imageOptional = imageService.getImageBySiteInfoName("testUsageSendStatus");

        Image image = imageOptional.get();
        assertEquals("1", image.getId());
        assertEquals("headerLeftImage", image.getDescription());
        Optional<Image> imageOptional2 = imageService.getImageBySiteInfoName("reportsDirectory");

        Image image2 = imageOptional2.get();
        assertEquals("2", image2.getId());
        assertEquals("headerRightImage", image2.getDescription());
    }

    @Test
    public void getDeleteImage() {
        Image image = imageService.get("1");
        imageService.delete(image);
        List<Image> images = imageService.getAll();
        assertEquals(3, images.size());

    }

    @Test
    public void deleteAll() {
        List<Image> images = imageService.getAll();
        imageService.deleteAll(images);
        List<Image> imagesd = imageService.getAll();
        assertEquals(0, imagesd.size());
    }

    @Test
    public void getAllMatching() {
        List<Image> images = imageService.getAllMatching("description", "headerRightImage");
        assertEquals(1, images.size());
    }

    @Test
    public void getAll() {
        List<Image> images = imageService.getAll();
        assertEquals("1", images.get(0).getId());
        assertEquals("2", images.get(1).getId());
        assertEquals("3", images.get(2).getId());
        assertEquals("4", images.get(3).getId());
    }

    @Test
    public void insertImage_shouldInsertImages() {
        imageService.deleteAll(imageService.getAll());
        Image image = new Image();
        image.setId("5");
        image.setDescription("BottonRightImage");
        image.setImage(image2);
        imageService.insert(image);
        List<Image> images = imageService.getAll();
        assertEquals(1, images.size());

    }

    @Test
    public void saveImage_shouldSaveImages() {
        imageService.deleteAll(imageService.getAll());
        Image image = new Image();
        image.setDescription("BottonRightImage");
        image.setImage(image2);
        Image image2 = imageService.save(image);
        List<Image> images = imageService.getAll();
        assertEquals(1, images.size());
        assertNotNull(image2);

    }

}