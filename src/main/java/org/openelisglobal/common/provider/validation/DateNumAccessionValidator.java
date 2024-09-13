/**
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations under
 * the License.
 *
 * The Original Code is OpenELIS code.
 *
 * Copyright (C) The Minnesota Department of Health.  All Rights Reserved.
 *
 * Contributor(s): CIRG, University of Washington, Seattle WA.
 */
package org.openelisglobal.common.provider.validation;

import java.util.HashSet;
import java.util.Set;

import org.openelisglobal.common.log.LogEvent;
import org.openelisglobal.common.util.ConfigurationProperties;
import org.openelisglobal.common.util.ConfigurationProperties.Property;
import org.openelisglobal.common.util.DateUtil;
import org.openelisglobal.internationalization.MessageUtil;
import org.openelisglobal.sample.service.SampleService;
import org.openelisglobal.sample.util.AccessionNumberUtil;
import org.openelisglobal.spring.util.SpringContext;

public class DateNumAccessionValidator implements IAccessionNumberGenerator {

    protected SampleService sampleService = SpringContext.getBean(SampleService.class);

    private static final boolean NEED_PROGRAM_CODE = false;
    private static final String DATE_PATTERN = "yyMMdd";
    private static Set<String> REQUESTED_NUMBERS = new HashSet<>();
    private String incrementStartingValue = "001"; // this value will be changed by the calling validator factory 
    private int acccessionLength = 10;
    private int incrementLength = 3;
    private String incrementFormat;
    
    public DateNumAccessionValidator(int length) {
        this.incrementLength = length;
        incrementFormat = "%0" + String.valueOf(length) + "d";
        incrementStartingValue = String.format(incrementFormat, 1);
        acccessionLength = length + 6;
    }
    
    @Override
    public boolean needProgramCode() {
        return NEED_PROGRAM_CODE;
    }

    @Override
    public ValidationResults validFormat(String accessionNumber, boolean checkDate) {
        if (!Boolean
                .valueOf(ConfigurationProperties.getInstance().getPropertyValue(Property.ACCESSION_NUMBER_VALIDATE))) {
            return AccessionNumberUtil.containsBlackListCharacters(accessionNumber) ? ValidationResults.FORMAT_FAIL
                    : ValidationResults.SUCCESS;
        }
        // The rule is YYMMDD formatted date and incremented numbers
        if (accessionNumber.length() != acccessionLength)
            return ValidationResults.LENGTH_FAIL;

        if (checkDate) {
            if (!DateUtil.getCurrentDateAsText(DATE_PATTERN).equals(accessionNumber.substring(0, 6)))
                return ValidationResults.FORMAT_FAIL;
        }

        return ValidationResults.SUCCESS;
    }

    @Override
    public String getInvalidMessage(ValidationResults results) {
        switch (results) {
            case LENGTH_FAIL:
                LogEvent.logError(DateNumAccessionValidator.class.getSimpleName(), "getInvalidMessage", "LENGTH_FAIL");
                return MessageUtil.getMessage("sample.entry.invalid.accession.number.length");
            case USED_FAIL:
                LogEvent.logError(DateNumAccessionValidator.class.getSimpleName(), "getInvalidMessage", "USED_FAIL");
                return MessageUtil.getMessage("sample.entry.invalid.accession.number.suggestion") + " " + getNextAvailableAccessionNumber(null, true);
            case FORMAT_FAIL:
                LogEvent.logError(DateNumAccessionValidator.class.getSimpleName(), "getInvalidMessage", "FORMAT_FAIL");
                return getInvalidFormatMessage(results);
            default:
                return MessageUtil.getMessage("sample.entry.invalid.accession.number");
        }
    }
    
    /**
     * Returns an accession number of format; YYMMDD### e.g. 230405001
     */
    @Override
    public String getNextAvailableAccessionNumber(String prefix, boolean reserve) {
        prefix = DateUtil.getCurrentDateAsText(DATE_PATTERN);
        String nextAccessionNumber;
        String curLargestAccessionNumber = sampleService.getLargestAccessionNumberWithPrefix(prefix);
        if (curLargestAccessionNumber == null) {
            if (!REQUESTED_NUMBERS.isEmpty() && !REQUESTED_NUMBERS.iterator().next().substring(0, 6).equals(prefix)) REQUESTED_NUMBERS.clear();
            nextAccessionNumber = REQUESTED_NUMBERS.isEmpty() ? createFirstAccessionNumber() : REQUESTED_NUMBERS.iterator().next();
        } else
            nextAccessionNumber = incrementAccessionNumber(curLargestAccessionNumber);

        while (REQUESTED_NUMBERS.contains(nextAccessionNumber)) {
            nextAccessionNumber = incrementAccessionNumber(nextAccessionNumber);
        }

        REQUESTED_NUMBERS.add(nextAccessionNumber);

        return nextAccessionNumber;
    }

    @Override
    public int getMaxAccessionLength() {
        return acccessionLength;
    }

    @Override
    public int getMinAccessionLength() {
        return getMaxAccessionLength();
    }

    // recordType parameter is not used in this case
    @Override
    public boolean accessionNumberIsUsed(String accessionNumber, String recordType) {
        return sampleService.getSampleByAccessionNumber(accessionNumber) != null;
    }

    @Override
    public ValidationResults checkAccessionNumberValidity(String accessionNumber, String recordType, String isRequired, String projectFormName) {
        ValidationResults results = validFormat(accessionNumber, true);
        if (results == ValidationResults.SUCCESS && accessionNumberIsUsed(accessionNumber, null))
            results = ValidationResults.USED_FAIL;
        
        return results;
    }

    @Override
    public String getInvalidFormatMessage(ValidationResults results) {
        return MessageUtil.getMessage("sample.entry.invalid.accession.number.format.corrected", new String[] { getFormatPattern(), getFormatExample() });
    }
    
    @Override
    public int getInvarientLength() {
        return 0;
    }

    @Override
    public int getChangeableLength() {
        return getMaxAccessionLength() - getInvarientLength();
    }

    @Override
    public String getPrefix() {
        return DateUtil.getCurrentDateAsText(DATE_PATTERN);
    }

    @Override
    public String getNextAccessionNumber(String datePrefix, boolean reserve) {
        return this.getNextAvailableAccessionNumber(datePrefix, reserve);
    }
    
    private String createFirstAccessionNumber() {
        return getPrefix() + incrementStartingValue;
    }
    
    private String getFormatPattern() {
        return DATE_PATTERN + "XXX";
    }

    private String getFormatExample() {
        return createFirstAccessionNumber();
    }
    
    public String incrementAccessionNumber(String currentHighAccessionNumber) {
        int nextSeq = Integer.parseInt(currentHighAccessionNumber.substring(currentHighAccessionNumber.length()- incrementLength)) + 1;
        
        StringBuilder strMaxAccessionNumber = new StringBuilder();
        strMaxAccessionNumber.append("9".repeat(incrementLength));
        
        if (nextSeq > Integer.parseInt(strMaxAccessionNumber.toString()))
            throw new IllegalArgumentException("AccessionNumber has no next value");
        
        return currentHighAccessionNumber.substring(0, acccessionLength - incrementLength) + String.format(incrementFormat, nextSeq);
    }
}
