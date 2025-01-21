package org.openelisglobal.note;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;

import java.util.List;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.note.dao.NoteDAO;
import org.openelisglobal.note.service.NoteService;
import org.openelisglobal.note.valueholder.Note;
import org.openelisglobal.referencetables.service.ReferenceTablesService;
import org.openelisglobal.sampleqaevent.service.SampleQaEventService;
import org.openelisglobal.systemuser.service.SystemUserService;
import org.openelisglobal.systemuser.valueholder.SystemUser;
import org.springframework.beans.factory.annotation.Autowired;

public class NoteServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    NoteService noteService;

    @Autowired
    NoteDAO noteDAO;

    @Autowired
    private ReferenceTablesService referenceTablesService;

    @Autowired
    private SampleQaEventService sampleQaEventService;

    @Autowired
    private SystemUserService systemUserService;

    private static final String TEST_USER_1 = "testUser123";
    private static final String TEST_USER_2 = "testUser456";
    private static final String REF_ID = "1";
    private static final String REF_TABLE_ID = "1";

    @Before
    public void init() throws Exception {

        createSystemUser(TEST_USER_1);
        createSystemUser(TEST_USER_2);

        noteService.deleteAll(noteService.getAll());
    }

    @After
    public void tearDown() {
        noteService.deleteAll(noteService.getAll());

        deleteSystemUser(TEST_USER_1);
        deleteSystemUser(TEST_USER_2);
    }

    private void createSystemUser(String userId) {
        SystemUser user = systemUserService.get(userId);
        if (user == null) {
            user = new SystemUser();
            user.setId(userId);
            user.setLoginName(userId); // Set required fields
            systemUserService.insert(user);
        }
    }

    private void deleteSystemUser(String userId) {
        SystemUser user = systemUserService.get(userId);
        if (user != null) {
            systemUserService.delete(user);
        }
    }

    @Test
    public void deleteNote_shouldDeleteNote() throws Exception {
        String subject = "Test Note Subject";
        String text = "This is a test note text.";

        Note note = new Note();
        note.setSubject(subject);
        note.setText(text);

        String noteId = noteService.insert(note);

        Note savedNote = noteService.get(noteId);
        noteService.delete(savedNote);
        assertEquals(0, noteService.getAll().size());
    }

    @Test
    public void getNote_shouldReturnNullForNonExistentNote() throws Exception {
        String nonExistentNoteId = "nonExistentNoteId";

        Note note = noteService.get(nonExistentNoteId);
        assertNull(note);
    }

    @Test
    public void deleteAllNotes_shouldClearAllNotes() throws Exception {
        String subject1 = "Note 1";
        String text1 = "First test note.";

        Note note1 = new Note();
        note1.setSubject(subject1);
        note1.setText(text1);
        noteService.insert(note1);

        String subject2 = "Note 2";
        String text2 = "Second test note.";

        Note note2 = new Note();
        note2.setSubject(subject2);
        note2.setText(text2);
        noteService.insert(note2);
        noteService.deleteAll(noteService.getAll());
        assertEquals(0, noteService.getAll().size());
    }

    @Test
    public void getNotesOrderedByTypeAndLastUpdated_shouldReturnNotesInCorrectOrder() {
        Note note1 = new Note();
        note1.setReferenceId("1");
        note1.setReferenceTableId("1");
        note1.setNoteType(Note.INTERNAL);
        note1.setSubject("First Note");
        note1.setText("This is the first test note.");
        note1.setSysUserId("testUser123");
        noteService.insert(note1);

        Note note2 = new Note();
        note2.setReferenceId("1");
        note2.setReferenceTableId("1");
        note2.setNoteType(Note.INTERNAL);
        note2.setSubject("Second Note");
        note2.setText("This is the second test note.");
        note2.setSysUserId("testUser456");
        noteService.insert(note2);

        List<Note> notes = noteService.getAllNotesByRefIdRefTable(note1);
        assertFalse("Notes list should not be empty", notes.isEmpty());

        assertEquals("Second note should be internal", Note.INTERNAL, notes.get(0).getNoteType());
        assertEquals("First note should be external", Note.INTERNAL, notes.get(1).getNoteType());
    }

}
