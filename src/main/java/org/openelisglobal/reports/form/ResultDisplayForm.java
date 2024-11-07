package org.openelisglobal.reports.form;

import org.openelisglobal.common.form.IPagingForm;
import org.openelisglobal.common.paging.PagingBean;

import java.util.List;

public class ResultDisplayForm implements IPagingForm {

    private PagingBean paging;

    private List<ResultViewBean> displayItems;

    public void setDisplayItems(List<ResultViewBean> displayItems) {
        this.displayItems = displayItems;
    }

    public List<ResultViewBean> getDisplayItems() {
        return displayItems;
    }

    @Override
    public void setPaging(PagingBean paging) {
        this.paging = paging;
    }

    @Override
    public PagingBean getPaging() {
        return paging;
    }
}
