package org.openelisglobal.reports.action.implementation.reportBeans;

import org.openelisglobal.reports.action.implementation.Report.DateRange;
import org.openelisglobal.reports.form.ReportForm.DateType;

import java.sql.Date;

import static org.openelisglobal.reports.action.implementation.reportBeans.CSVColumnBuilder.Strategy.NONE;

/**
 * @author Samuel T. Mbugua (sthaiya@mu.ac.ke)
 * @since April 15, 2025
 */
public class CSVPeriodByDateColumnBuilder extends CSVColumnBuilder {

    private DateRange dateRange;
    private DateType dateType;

    /** */
    public CSVPeriodByDateColumnBuilder(DateRange dateRange) {
        super(null);
        this.dateRange = dateRange;
        defineAllColumns();
    }

    /**
     * This is the order we want them in the CSV file, but if you change this you
     * have to rerun generateJasperXML (see commented out call in c'tor above) and
     * paste each chunk into the JasperReports XML.
     */
    private void defineAllColumns() {
        add("samp_id", "SAMP_ID", NONE);
        add("lab_no", "LAB_NO", NONE);
        add("identifier", "IDENTIFIER", NONE);
        add("first_name", "FIRST_NAME", NONE);
        add("last_name", "LAST_NAME", NONE);
        add("gender", "GENDER", NONE);
        add("birthdate", "BIRTHDATE", NONE);
        add("date_received", "DATE_RECEIVED", NONE);
        add("date_entered", "DATE_ENTERED", NONE);
        add("study_code", "STUDY_CODE", NONE);
        add("study", "STUDY", NONE);
        add("sample_type", "SAMPLE_TYPE", NONE);
        add("test_name", "TEST_NAME", NONE);
        add("panel", "PANEL", NONE);
    }

    /**
     * return the SQL for one big row for each sample item in the date range for the particular project.
     */
    @Override
    public void makeSQL() {
        // Switch date column according to selected DateType: PK
        query = new StringBuilder();
        Date lowDate = dateRange.getLowDate();
        Date highDate = dateRange.getHighDate();

        query.append("SELECT s.id as samp_id, s.accession_number as lab_no, pt.national_id as identifier, "
                + "p.first_name, p.last_name, pt.gender, pt.entered_birth_date as birthdate, "
                + "to_char(s.received_date, 'YYYY-mm-dd HH24:MI') as date_received, "
                + "to_char(s.entered_date, 'YYYY-mm-dd HH24:MI') as date_entered, "
                + "o.short_name as study_code, o.name as study, an.type_of_sample_name as sample_type, t.name as test_name, "
                + "(SELECT name FROM panel WHERE id=an.panel_id) as panel "
                + "FROM sample s "
                + "INNER JOIN sample_human sh ON sh.samp_id=s.id "
                + "INNER JOIN patient pt ON pt.id=sh.patient_id  "
                + "INNER JOIN person p ON p.id=pt.person_id "
                + "INNER JOIN sample_requester org ON org.sample_id=s.id "
                + "INNER JOIN organization o ON o.id=org.requester_id "
                + "INNER JOIN sample_item si ON si.samp_id = s.id "
                + "INNER JOIN analysis an ON an.sampitem_id = si.id "
                + "INNER JOIN test t ON t.id = an.test_id "
                + "WHERE org.requester_type_id = 1 "
                + "AND s.entered_date >= '" + formatDateForDatabaseSql(lowDate) + "' "
                + "AND s.entered_date <= '" + formatDateForDatabaseSql(highDate) + "' "
                + "ORDER BY s.id "
        );
    }
}
