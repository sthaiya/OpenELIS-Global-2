import {
    Button,
    Checkbox,
    Column,
    DataTable,
    Grid,
    Heading,
    Pagination,
    Section,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableHeader,
    TableHead,
    TableRow,
    TableCell,
    TableSelectAll,
    TableSelectRow,
    TableToolbar,
    TableToolbarContent,
    TableToolbarAction,
    TableContainer,
    TableToolbarSearch,
    TableBatchActions,
    TableBatchAction,
} from "@carbon/react";
import "../../Style.css";
import "./rrStyle.css";
import React, {useState, useEffect, useRef} from "react";

import {FormattedMessage, useIntl} from "react-intl";
import {getFromOpenElisServer, Roles} from "../../utils/Utils";
import {format} from "date-fns";
import {DatePicker, DatePickerInput} from "@carbon/react";
import AutoComplete from "../../common/AutoComplete";
import config from "../../../config.json";
import { Printer } from '@carbon/react/icons';


const DispatchReport = ({id}) => {
    const componentMounted = useRef(false);
    const intl = useIntl();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [data, setData] = useState([]);

    const [testSections, setTestSections] = useState([]);
    const [defaultTestSectionId, setDefaultTestSectionId] = useState("");
    const [defaultTestSectionLabel, setDefaultTestSectionLabel] = useState("");
    const [siteNames, setSiteNames] = useState([]);
    const [selectedSiteId, setSelectedSiteId] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showPrinted, setShowPrinted] = useState(false);

    const handlePageChange = (pageInfo) => {
        setPage(pageInfo.page);
        setPageSize(pageInfo.pageSize);
    };

    const getTestSections = (fetchedTestSections) => {
        if (componentMounted.current) {
            let testSectionId = "";
            let testSectionLabel = "";
            setDefaultTestSectionId(testSectionId);
            setDefaultTestSectionLabel(testSectionLabel);

            fetchedTestSections.unshift({id: testSectionId, value: testSectionLabel});
            setTestSections(fetchedTestSections);
        }
    };

    const getSites = (sites) => {
        if (componentMounted.current)
            setSiteNames(sites);
    };

    const loadData = (res) => {
        // If the response object is not null and has displayItems array with length greater than 0 then set it as data.
        if (res && res.displayItems && res.displayItems.length > 0) {
            setData(res.displayItems);
        } else {
            setData([]);
        }

        // Sets next and previous page numbers based on the total pages and current page number.
        if (res && res.paging) {
            const {totalPages, currentPage} = res.paging;
            if (totalPages > 1) {
                setPagination(true);
                if (parseInt(currentPage) < parseInt(totalPages)) {
                    setNextPage(parseInt(currentPage) + 1);
                } else {
                    setNextPage(null);
                }

                if (parseInt(currentPage) > 1) {
                    setPreviousPage(parseInt(currentPage) - 1);
                } else {
                    setPreviousPage(null);
                }
            }
        }
    };

    const reportHeaders = [
        {key: "patientId", header: <FormattedMessage id="patient.id"/>},
        {key: "patientName", header: <FormattedMessage id="patient.label"/>},
        {key: "orderDate", header: <FormattedMessage id="sample.label.orderdate"/>},
        {key: "resultDateForDisplay", header: <FormattedMessage id="referral.search.column.resultDate"/>},
        {key: "accessionNumber", header: <FormattedMessage id="quick.entry.accession.number"/>},
        {key: "testSectionName", header: <FormattedMessage id="field.testUnit"/>}
    ];

    useEffect(() => {
        componentMounted.current = true;
        const today = new Date();

        // Set the filter dates - default to last seven days
        const sevenDaysAgo = new Date(today).setDate(today.getDate() - 7);
        const formattedToday = format(today, "dd/MM/yyyy");
        const formattedSevenDaysAgo = format(sevenDaysAgo, "dd/MM/yyyy");

        setStartDate(formattedSevenDaysAgo);
        setEndDate(formattedToday);

        getFromOpenElisServer("/rest/site-names", getSites);
        getFromOpenElisServer("/rest/user-test-sections/" + Roles.RESULTS, (resp) => getTestSections(resp));

        searchByParams(formattedSevenDaysAgo, formattedToday);

        window.scrollTo(0, 0);
        return () => {
            componentMounted.current = false;
        };
    }, []);

    function searchByParams(locStartDate, locEndDate) {
        const params = new URLSearchParams({
            startDate: startDate ? startDate : locStartDate,
            endDate: endDate ? endDate : locEndDate,
            testSection: defaultTestSectionId,
            referringSite: selectedSiteId,
            showPrinted: showPrinted
        });
        getFromOpenElisServer("/rest/report/unprinted-results?" + params.toString(), loadData,);
    }

    function printSelected(rowId) {
        const row = data.find(row => {return row.id === rowId;});
        let barcodesPdf =
            config.serverBaseUrl +
            `/ReportPrint?report=patientCILNSP_vreduit&type=patient&accessionDirect=${row.accessionNumber}&highAccessionDirect=${row.accessionNumber}&onlyResults=on&_onlyResults=on&labSections=${row.testSectionId}&_labSections=on`;
        window.open(barcodesPdf);
    }

    function batchActionClick (selectedRows) {
        selectedRows.forEach(r => {
            console.log(r);
        });
    }

    return (
        <>
            <Grid fullWidth={true}>
                <Column lg={4} md={4} sm={4}>
                    <Section style={{marginBottom: "1rem"}}>
                        <Heading><FormattedMessage id={id}/></Heading>
                    </Section>
                </Column>
            </Grid>

            <Grid fullWidth={true}>
                <Column lg={2}>
                    <Select
                        name="test-unit-id"
                        id="test-unit-id"
                        labelText={intl.formatMessage({id: "field.testUnit"})}
                        onChange={(e) => {
                            setDefaultTestSectionId(e.target.value);
                            setDefaultTestSectionLabel(e.target.selectedOptions[0].text);
                        }}>
                        {testSections
                            .map((item, idx) => {
                                return (
                                    <SelectItem key={idx} value={item.id} text={item.value}/>
                                );
                            })}
                    </Select>
                </Column>

                <Column lg={3}>
                    <AutoComplete
                        name="siteName"
                        id="siteName"
                        value={ selectedSiteId }
                        onSelect={setSelectedSiteId}
                        label={intl.formatMessage({id: "banner.menu.sampleCreate"})}
                        style={{ width: "!important 100%" }}
                        suggestions={siteNames.length > 0 ? siteNames : []}
                    />
                </Column>

                <Column lg={2}>
                    <div>
                        <DatePicker datePickerType="single" dateFormat="d-m-Y" size="md" value={startDate}
                                    maxDate={format(new Date().setDate(new Date().getDate()), 'dd/MM/yyyy')}
                                    onChange={(e) => {
                                        let date = new Date(e[0]);
                                        const formattedDate = format(new Date(date), "dd/MM/yyyy");
                                        setStartDate(formattedDate);
                                    }}>
                            <DatePickerInput id="date-picker-input-id-start" placeholder="dd/mm/yyyy"
                                             labelText={intl.formatMessage({id: "eorder.date.start"})}/>
                        </DatePicker>
                    </div>
                </Column>

                <Column lg={2}>
                    <div>
                        <DatePicker datePickerType="single" dateFormat="d-m-Y" size="md" value={endDate}
                                    maxDate={format(new Date().setDate(new Date().getDate()), 'dd/MM/yyyy')}
                                    onChange={(e) => {
                                        let date = new Date(e[0]);
                                        const formattedDate = format(new Date(date), "dd/MM/yyyy");
                                        setEndDate(formattedDate);
                                    }}>
                            <DatePickerInput id="date-picker-input-id-end" placeholder="dd/mm/yyyy"
                                             labelText={intl.formatMessage({id: "eorder.date.end"})}/>
                        </DatePicker>
                    </div>
                </Column>

                <Column lg={2}>
                    <div className="bottomAlign" style={{marginLeft: "1rem"}}>
                        <Checkbox
                            id="showPrinted"
                            labelText="Show Printed"
                            onChange={(e) => {
                                setShowPrinted(e.currentTarget.checked);
                            }}
                        />
                    </div>
                </Column>

                <Column lg={2}>
                    <div className="bottomAlign">
                        <Button onClick={searchByParams} size="md">
                            <FormattedMessage id="label.button.search"/>
                        </Button>
                    </div>
                </Column>

                <Column lg={16}><br/></Column>

                <Column lg={16}>
                    <DataTable rows={data ?? []} headers={reportHeaders} isSortable useZebraStyles>
                        {({ rows,
                            headers,
                            getHeaderProps,
                            getTableProps,
                            getSelectionProps,
                            getTableContainerProps,
                            getToolbarProps,
                            getBatchActionProps,
                            onInputChange,
                            selectedRows,
                            selectRow,
                        }) => {
                            const batchActionProps = {
                                ...getBatchActionProps({
                                    onSelectAll: () => {
                                        rows.map(row => {
                                            if (!row.isSelected) {
                                                selectRow(row.id);
                                            }
                                        });
                                    }
                                })
                            };

                            return <TableContainer title="" description="" {...getTableContainerProps()}>
                                <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                                    <TableBatchActions {...batchActionProps}>
                                        <TableBatchAction tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1} renderIcon={Printer} onClick={() => batchActionClick(selectedRows)}>
                                            Print Selected
                                        </TableBatchAction>
                                    </TableBatchActions>

                                    <TableToolbarContent aria-hidden={batchActionProps.shouldShowBatchActions}>
                                        <TableToolbarSearch onChange={onInputChange} persistent placeholder="Accession No/Patient Name..."/>
                                    </TableToolbarContent>
                                </TableToolbar>

                                <Table {...getTableProps()} isSortable>
                                    <TableHead>
                                        <TableRow>
                                            <TableSelectAll {...getSelectionProps()} />
                                            {headers.map((header) => (
                                                <TableHeader key={header.key} {...getHeaderProps({header})}>
                                                    {header.header}
                                                </TableHeader>
                                            ))}
                                            <TableHeader key="action">Action</TableHeader>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows
                                            .slice((page - 1) * pageSize)
                                            .slice(0, pageSize)
                                            .map(row => (
                                                <TableRow key={row.id}>
                                                    <TableSelectRow {...getSelectionProps({row})} />
                                                    {row.cells.map((cell) => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                    <TableCell>
                                                        <Button onClick={() => printSelected(row.id)} size="sm"  className={"printBtn"} kind="tertiary">Print</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        }}
                    </DataTable>



                    <Pagination
                        onChange={handlePageChange}
                        page={page}
                        pageSize={pageSize}
                        pageSizes={[10, 20, 30, 50, 100]}
                        totalItems={data.length}
                        forwardText={intl.formatMessage({id: "pagination.forward"})}
                        backwardText={intl.formatMessage({id: "pagination.backward"})}
                        itemRangeText={(min, max, total) => intl.formatMessage({id: "pagination.item-range"}, {
                            min: min,
                            max: max,
                            total: total
                        })}
                        itemsPerPageText={intl.formatMessage({id: "pagination.items-per-page"})}
                        itemText={(min, max) => intl.formatMessage({id: "pagination.item"}, {min: min, max: max})}
                        pageNumberText={intl.formatMessage({id: "pagination.page-number"})}
                        pageRangeText={(_current, total) => intl.formatMessage({id: "pagination.page-range"}, {total: total})}
                        pageText={(page, pagesUnknown) => intl.formatMessage({id: "pagination.page"}, {page: pagesUnknown ? "" : page})}
                    />
                </Column>
            </Grid>
        </>
    );
};

export default DispatchReport;
