package org.openelisglobal.barcode;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.Writer;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.encoder.QRCode;

import com.lowagie.text.BadElementException;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Image;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.Barcode;
import com.lowagie.text.pdf.Barcode128;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfTemplate;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;

import java.awt.image.BufferedImage;
import java.awt.Graphics2D;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.imageio.ImageIO;

import org.openelisglobal.barcode.labeltype.BlankLabel;
import org.openelisglobal.barcode.labeltype.BlockLabel;
import org.openelisglobal.barcode.labeltype.Label;
import org.openelisglobal.barcode.labeltype.OrderLabel;
import org.openelisglobal.barcode.labeltype.SlideLabel;
import org.openelisglobal.barcode.labeltype.SpecimenLabel;
import org.openelisglobal.barcode.service.BarcodeLabelInfoService;
import org.openelisglobal.common.exception.LIMSInvalidConfigurationException;
import org.openelisglobal.common.log.LogEvent;
import org.openelisglobal.common.provider.validation.AltYearAccessionValidator;
import org.openelisglobal.common.provider.validation.IAccessionNumberGenerator;
import org.openelisglobal.common.services.IStatusService;
import org.openelisglobal.common.services.StatusService.SampleStatus;
import org.openelisglobal.common.util.ConfigurationProperties;
import org.openelisglobal.common.util.ConfigurationProperties.Property;
import org.openelisglobal.patient.service.PatientService;
import org.openelisglobal.patient.valueholder.Patient;
import org.openelisglobal.sample.service.SampleService;
import org.openelisglobal.sample.util.AccessionNumberUtil;
import org.openelisglobal.sample.valueholder.Sample;
import org.openelisglobal.sampleitem.service.SampleItemService;
import org.openelisglobal.sampleitem.valueholder.SampleItem;
import org.openelisglobal.spring.util.SpringContext;
import org.openelisglobal.test.valueholder.Test;

public class BarcodeLabelMaker {

    public enum BarcodeType {
        BARCODE, QR
    }

    private BarcodeType barcodeType;
    private static int NUM_COLUMNS = 20;
    private ArrayList<Label> labels;
    private String override;
    private String sysUserId;
    private BarcodeLabelInfoService barcodeLabelService = SpringContext.getBean(BarcodeLabelInfoService.class);
    private static final Set<Integer> ENTERED_STATUS_SAMPLE_LIST = new HashSet<>();

    static {
        ENTERED_STATUS_SAMPLE_LIST
                .add(Integer.parseInt(SpringContext.getBean(IStatusService.class).getStatusID(SampleStatus.Entered)));
    }

    public BarcodeLabelMaker() {
        labels = new ArrayList<>();
    }

    public BarcodeLabelMaker(Label label) {
        labels = new ArrayList<>();
        labels.add(label);
    }

    public BarcodeLabelMaker(ArrayList<Label> labels) {
        this.labels = labels;
    }

    public void setFormat(String format) {
        this.barcodeType = "qr".equalsIgnoreCase(format) ? BarcodeType.QR : BarcodeType.BARCODE;
    }

    public void generateGenericBarcodeLabel(String code, String type) {
        if ("block".equals(type)) {
            BlockLabel label = new BlockLabel(code);
            labels.add(label);
        } else if ("slide".equals(type)) {
            SlideLabel label = new SlideLabel(code);
            labels.add(label);
        }
    }

    public void generatePrePrintLabels(Integer numSetsOfLabels, Integer numOrderLabelsPerSet,
            Integer numSpecimenLabelsPerSet, String facilityName, List<Test> tests, String startingAt)
            throws LIMSInvalidConfigurationException {
        IAccessionNumberGenerator accessionValidator = null;
        if (Boolean
                .valueOf(ConfigurationProperties.getInstance().getPropertyValue(Property.USE_ALT_ACCESSION_PREFIX))) {
            accessionValidator = AccessionNumberUtil.getAltAccessionNumberGenerator();
            ((AltYearAccessionValidator) accessionValidator).setOverrideStartingAt(startingAt);
        }
        for (int i = 0; i < numSetsOfLabels; ++i) {
            String accessionNumber = genNextPrePrintedAccessionNumber(accessionValidator, startingAt);
            OrderLabel orderLabel = new OrderLabel(accessionNumber, facilityName);
            orderLabel.setNumLabels(numOrderLabelsPerSet);
            labels.add(orderLabel);

            SpecimenLabel specimenLabel = new SpecimenLabel(accessionNumber, facilityName, tests);
            specimenLabel.setNumLabels(numSpecimenLabelsPerSet);
            labels.add(specimenLabel);
        }
    }

    private String genNextPrePrintedAccessionNumber(IAccessionNumberGenerator accessionValidator, String startingAt)
            throws LIMSInvalidConfigurationException {
        if (accessionValidator == null) {
            accessionValidator = AccessionNumberUtil.getMainAccessionNumberGenerator();
        }
        return accessionValidator.getNextAvailableAccessionNumber("", true);
    }

    public void generateLabels(String labNo, String type, String quantity, String override) {
        SampleService sampleService = SpringContext.getBean(SampleService.class);
        SampleItemService sampleItemService = SpringContext.getBean(SampleItemService.class);
        if ("default".equals(type)) {
            Sample sample = sampleService.getSampleByAccessionNumber(labNo);
            OrderLabel orderLabel = new OrderLabel(sampleService.getPatient(sample), sample, labNo);
            orderLabel.setNumLabels(Integer
                    .parseInt(ConfigurationProperties.getInstance().getPropertyValue(Property.DEFAULT_ORDER_PRINTED)));
            orderLabel.linkBarcodeLabelInfo();
            orderLabel.setSysUserId(sysUserId);
            if (orderLabel.checkIfPrintable() || "true".equals(override)) {
                labels.add(orderLabel);
            }

            List<SampleItem> sampleItemList = sampleItemService.getSampleItemsBySampleIdAndStatus(sample.getId(),
                    ENTERED_STATUS_SAMPLE_LIST);
            for (SampleItem sampleItem : sampleItemList) {
                SpecimenLabel specLabel = new SpecimenLabel(sampleService.getPatient(sample), sample, sampleItem,
                        labNo);
                specLabel.setNumLabels(Integer.parseInt(
                        ConfigurationProperties.getInstance().getPropertyValue(Property.DEFAULT_SPECIMEN_PRINTED)));
                specLabel.linkBarcodeLabelInfo();
                specLabel.setSysUserId(sysUserId);
                if (specLabel.checkIfPrintable() || "true".equals(override)) {
                    labels.add(specLabel);
                }
            }
        } else if ("order".equals(type)) {
            Sample sample = sampleService.getSampleByAccessionNumber(labNo);
            OrderLabel orderLabel = new OrderLabel(sampleService.getPatient(sample), sample, labNo);
            orderLabel.setNumLabels(Integer.parseInt(quantity));
            orderLabel.linkBarcodeLabelInfo();
            orderLabel.setSysUserId(sysUserId);
            if (orderLabel.checkIfPrintable() || "true".equals(override)) {
                labels.add(orderLabel);
            }
        } else if ("specimen".equals(type)) {
            String specimenNumber = labNo.substring(labNo.lastIndexOf(".") + 1);
            labNo = labNo.substring(0, labNo.lastIndexOf("."));
            Sample sample = sampleService.getSampleByAccessionNumber(labNo);
            List<SampleItem> sampleItemList = sampleItemService.getSampleItemsBySampleIdAndStatus(sample.getId(),
                    ENTERED_STATUS_SAMPLE_LIST);
            for (SampleItem sampleItem : sampleItemList) {
                if (sampleItem.getSortOrder().equals(specimenNumber)) {
                    SpecimenLabel specLabel = new SpecimenLabel(sampleService.getPatient(sample), sample, sampleItem,
                            labNo);
                    specLabel.setNumLabels(Integer.parseInt(quantity));
                    specLabel.linkBarcodeLabelInfo();
                    specLabel.setSysUserId(sysUserId);
                    if (specLabel.checkIfPrintable() || "true".equals(override)) {
                        labels.add(specLabel);
                    }
                }
            }
        } else if ("blank".equals(type)) {
            BlankLabel blankLabel = new BlankLabel(labNo);
            blankLabel.linkBarcodeLabelInfo();
            blankLabel.setSysUserId(sysUserId);
            if (blankLabel.checkIfPrintable() || "true".equals(override)) {
                labels.add(blankLabel);
            }
        }
    }

    public ByteArrayOutputStream createLabelsAsStream() {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        if (labels.isEmpty()) {
            return stream;
        }
        try {
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, stream);
            document.open();
            for (Label label : labels) {
                for (int i = 0; i < label.getNumLabels(); ++i) {
                    float ratio = label.getHeight() / label.getWidth();
                    label.pdfWidth = 350;
                    label.pdfHeight = label.pdfWidth * ratio;
                    drawLabel(label, writer, document);
                }
            }
            document.close();
            writer.close();
        } catch (Exception e) {
            LogEvent.logError(e);
        }
        return stream;
    }

    public ByteArrayOutputStream createLabelsAsStreamWithMaximumPrints() {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        if (labels.isEmpty()) {
            return stream;
        }
        try {
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, stream);
            document.open();
            for (Label label : labels) {
                for (int i = 0; i < label.getNumLabels(); ++i) {
                    if (label.checkIfPrintable() || "true".equals(override)) {
                        float ratio = label.getHeight() / label.getWidth();
                        label.pdfWidth = 350;
                        label.pdfHeight = label.pdfWidth * ratio;
                        drawLabel(label, writer, document);
                        label.incrementNumPrinted();
                    }
                }
                barcodeLabelService.save(label.getLabelInfo());
            }
            document.close();
            writer.close();
        } catch (DocumentException | IOException e) {
            LogEvent.logDebug(e);
        }
        return stream;
    }

    private void drawLabel(Label label, PdfWriter writer, Document document) throws DocumentException, IOException {
        Rectangle rec = new Rectangle(label.pdfWidth, label.pdfHeight);
        document.setPageSize(rec);
        document.newPage();

        if (barcodeType == BarcodeType.BARCODE) {
            // Original barcode layout logic
            PdfPTable table = new PdfPTable(NUM_COLUMNS);
            table.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            table.setTotalWidth(label.pdfWidth - (2 * label.getMargin()));
            table.setLockedWidth(true);

            Iterable<LabelField> fields = label.getAboveFields();
            if (fields != null) {
                for (LabelField field : fields) {
                    if (field.isStartNewline()) {
                        table.completeRow();
                    }
                    table.addCell(createFieldAsPDFField(label, field));
                }
                table.completeRow();
            }

            if (label.getScaledBarcodeSpace() != NUM_COLUMNS) {
                table.addCell(createSpacerCell((NUM_COLUMNS - label.getScaledBarcodeSpace()) / 2));
                table.addCell(create128Barcode(label, writer, label.getScaledBarcodeSpace()));
                table.addCell(createSpacerCell((NUM_COLUMNS - label.getScaledBarcodeSpace()) / 2));
            } else {
                table.addCell(create128Barcode(label, writer, label.getScaledBarcodeSpace()));
            }

            Iterable<LabelField> belowFields = label.getBelowFields();
            if (belowFields != null) {
                for (LabelField field : belowFields) {
                    if (field.isStartNewline()) {
                        table.completeRow();
                    }
                    table.addCell(createFieldAsPDFField(label, field));
                }
                table.completeRow();
            }

            document.add(scaleCentreTableAsImage(label, writer, table));
        } else {
            // QR code layout with QR on left, fields on right
            PdfPTable mainTable = new PdfPTable(2); // 2 columns for QR and fields
            mainTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            mainTable.setTotalWidth(label.pdfWidth - (2 * label.getMargin()));
            mainTable.setLockedWidth(true);
            float[] columnWidths = {0.4f, 0.6f}; // 40% for QR, 60% for fields
            mainTable.setWidths(columnWidths);

            // Left column - QR Code
            PdfPCell qrCell = createQRCode(label, writer, 1);
            qrCell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
            qrCell.setVerticalAlignment(PdfPCell.ALIGN_MIDDLE);
            mainTable.addCell(qrCell);

            // Right column - Fields Table
            PdfPTable fieldsTable = new PdfPTable(1);
            fieldsTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            fieldsTable.setWidthPercentage(100);

            // Add code text in larger font and bold
            com.lowagie.text.Font boldFont = new com.lowagie.text.Font(label.getValueFont());
            boldFont.setSize(15); // Larger font size
            boldFont.setStyle(com.lowagie.text.Font.BOLD);
            
            Paragraph codeText = new Paragraph(label.getCode(), boldFont);
            codeText.setAlignment(Paragraph.ALIGN_CENTER);
            PdfPCell codeCell = new PdfPCell(codeText);
            codeCell.setBorder(Rectangle.NO_BORDER);
            codeCell.setPadding(1);
            fieldsTable.addCell(codeCell);

            // Add above fields
            Iterable<LabelField> fields = label.getAboveFields();
            if (fields != null) {
                for (LabelField field : fields) {
                    fieldsTable.addCell(createFieldAsPDFField(label, field));
                }
            }

            // Add below fields
            Iterable<LabelField> belowFields = label.getBelowFields();
            if (belowFields != null) {
                for (LabelField field : belowFields) {
                    fieldsTable.addCell(createFieldAsPDFField(label, field));
                }
            }

            PdfPCell fieldsCell = new PdfPCell(fieldsTable);
            fieldsCell.setBorder(Rectangle.NO_BORDER);
            fieldsCell.setPadding(5);
            mainTable.addCell(fieldsCell);

            document.add(scaleCentreTableAsImage(label, writer, mainTable));
        }
    }

    private Image scaleCentreTableAsImage(Label label, PdfWriter writer, PdfPTable table) throws BadElementException {
        PdfContentByte cb = writer.getDirectContent();
        PdfTemplate template = cb.createTemplate(table.getTotalWidth(), table.getTotalHeight());
        table.writeSelectedRows(0, -1, 0, table.getTotalHeight(), template);
        Image labelAsImage = Image.getInstance(template);
        labelAsImage.scaleAbsoluteHeight(label.pdfHeight - (2 * label.getMargin()));
        labelAsImage.setAbsolutePosition(((label.pdfWidth) - labelAsImage.getScaledWidth()) / 2,
                ((label.pdfHeight) - labelAsImage.getScaledHeight()) / 2);
        return labelAsImage;
    }

    private PdfPCell create128Barcode(Label label, PdfWriter writer, int colspan)
            throws DocumentException, IOException {
        Barcode128 barcode = new Barcode128();
        barcode.setCodeType(Barcode.CODE128);
        barcode.setCode(label.getCode());
        barcode.setAltText(label.getCodeLabel());
        barcode.setBarHeight((10 - (label.getNumTextRowsBefore() + label.getNumTextRowsAfter())) * 30 / 10);
        PdfPCell cell = new PdfPCell(barcode.createImageWithBarcode(writer.getDirectContent(), null, null), true);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setColspan(colspan);
        cell.setPadding(1);
        return cell;
    }

    private PdfPCell createQRCode(Label label, PdfWriter writer, int colspan) 
            throws DocumentException, IOException {
        try {
            // Increased base size for QR code
            int qrSize = 1000; // Further increased for higher quality
            
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(
                label.getCode(), 
                BarcodeFormat.QR_CODE, 
                qrSize,
                qrSize
            );

            BufferedImage qrImage = new BufferedImage(qrSize, qrSize, BufferedImage.TYPE_INT_RGB);
            Graphics2D graphics = qrImage.createGraphics();
            graphics.setColor(java.awt.Color.WHITE);
            graphics.fillRect(0, 0, qrSize, qrSize);
            graphics.setColor(java.awt.Color.BLACK);

            for (int x = 0; x < qrSize; x++) {
                for (int y = 0; y < qrSize; y++) {
                    if (bitMatrix.get(x, y)) {
                        graphics.fillRect(x, y, 1, 1);
                    }
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", baos);
            Image qrCodeImage = Image.getInstance(baos.toByteArray());
            
            // Adjust cell to take up more space with minimal margins
            float availableWidth = (label.pdfWidth * 0.4f) - 4; // Reduced margin from 20 to 4
            float availableHeight = label.pdfHeight - 4; // Reduced margin from 20 to 4
            
            // Scale QR code to fill more space
            qrCodeImage.scaleToFit(availableWidth, availableHeight);

            PdfPCell cell = new PdfPCell(qrCodeImage, true);
            cell.setBorder(Rectangle.NO_BORDER);
            cell.setColspan(colspan);
            cell.setPadding(1); // Reduced padding from 5 to 2
            cell.setVerticalAlignment(PdfPCell.ALIGN_MIDDLE);
            cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);

            if (label.getCodeLabel() != null && !label.getCodeLabel().isEmpty()) {
                Paragraph textPara = new Paragraph(label.getCodeLabel(), label.getValueFont());
                cell.addElement(textPara);
            }

            return cell;

        } catch (Exception e) {
            LogEvent.logError(e);
            throw new DocumentException("Failed to create QR code: " + e.getMessage());
        }
    }

    private PdfPCell createFieldAsPDFField(Label label, LabelField field) {
        Paragraph fieldPDF = new Paragraph();
        if (field.isDisplayFieldName()) {
            Chunk name = new Chunk(field.getName() + ": ");
            name.setFont(label.getValueFont());
            fieldPDF.add(name);
        }
        Chunk value = new Chunk(field.getValue());
        value.setFont(label.getValueFont());
        if (field.isUnderline()) {
            Chunk underline = new Chunk(new LineSeparator(0.5f, 100, null, 0, -1));
            value.setUnderline(0.5f, -1);
            fieldPDF.add(value);
            fieldPDF.add(underline);
        } else {
            fieldPDF.add(value);
        }
        PdfPCell cell = new PdfPCell(fieldPDF);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setColspan(field.getColspan());
        cell.setPadding(1);

        return cell;
    }

    private PdfPCell createSpacerCell(int colspan) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setColspan(colspan);
        return cell;
    }

    private Patient getPatientForID(String personKey) {
        Patient patient = new Patient();
        patient.setId(personKey);
        PatientService patientService = SpringContext.getBean(PatientService.class);
        patientService.getData(patient);
        if (patient.getId() == null) {
            return null;
        } else {
            return patient;
        }
    }

    public void generateBlockLabel(Integer blockNumber) {
        // Placeholder method for future implementation
    }

    public String getOverride() {
        return override;
    }

    public void setOverride(String override) {
        this.override = override;
    }

    public String getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(String sysUserId) {
        this.sysUserId = sysUserId;
    }
}