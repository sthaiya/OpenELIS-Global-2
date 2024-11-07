package org.openelisglobal.reports.form;

public class ResultRequestForm {
    private String startDate;
    private String endDate;
    private String testSection;
    private String referringSite;
    private boolean showPrinted;

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getTestSection() {
        return testSection;
    }

    public void setTestSection(String testSection) {
        this.testSection = testSection;
    }

    public String getReferringSite() {
        return referringSite;
    }

    public void setReferringSite(String referringSite) {
        this.referringSite = referringSite;
    }

    public boolean showPrinted() {
        return showPrinted;
    }

    public void setShowPrinted(boolean showPrinted) {
        this.showPrinted = showPrinted;
    }
}
