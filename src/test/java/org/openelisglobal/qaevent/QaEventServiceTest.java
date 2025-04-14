package org.openelisglobal.qaevent;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.common.util.ConfigurationProperties;
import org.openelisglobal.qaevent.service.QaEventService;
import org.openelisglobal.qaevent.valueholder.QaEvent;
import org.springframework.beans.factory.annotation.Autowired;

public class QaEventServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private QaEventService qaEventService;

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/qa-event.xml");
    }

    @Test
    public void getAll_shouldReturnAllQaEvents() throws Exception {
        List<QaEvent> events = qaEventService.getAll();
        assertNotNull(events);
        assertEquals(2, events.size());
        assertEquals("1", events.get(0).getId());
        assertEquals("2", events.get(1).getId());
    }

    @Test
    public void getData_shouldReturnQaEvent() throws Exception {
        QaEvent qaEvent = qaEventService.get("1");
        qaEventService.getData(qaEvent);
        assertNotNull(qaEvent);
        assertEquals("1", qaEvent.getId());
        assertEquals("QA Event 1", qaEvent.getQaEventName());
    }

    @Test
    public void getQaEventByName_shouldReturnQaEvent() throws Exception {
        QaEvent qaEvent = new QaEvent();
        qaEvent.setQaEventName("QA Event 1");
        qaEvent = qaEventService.getQaEventByName(qaEvent);
        assertNotNull(qaEvent);
        assertEquals("1", qaEvent.getId());
        assertEquals("QA Event 1", qaEvent.getQaEventName());
    }

    @Test
    public void getAllQaEvents_shouldReturnAllQaEvents() throws Exception {
        List<QaEvent> events = qaEventService.getAllQaEvents();
        assertNotNull(events);
        assertEquals(2, events.size());
        assertEquals("1", events.get(0).getId());
        assertEquals("2", events.get(1).getId());
    }

    @Test
    public void getTotalQaEventCount_shouldReturnTotalQaEventCount() throws Exception {
        Integer count = qaEventService.getTotalQaEventCount();
        assertNotNull(count);
        assertEquals(2, count.intValue());
    }

    @Test
    public void getPageOfQaEvents_shouldReturnPageOfQaEvents() throws Exception {
        List<QaEvent> events = qaEventService.getPageOfQaEvents(1);
        int expectedPages = Integer
                .parseInt(ConfigurationProperties.getInstance().getPropertyValue("page.defaultPageSize"));
        assertTrue(expectedPages >= events.size());
    }

}
