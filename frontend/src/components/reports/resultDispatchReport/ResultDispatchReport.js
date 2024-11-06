import {
    Heading,
    Grid,
    Column,
    Section,
    DataTable,
    Select,
    SelectItem,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    Pagination,
    TableBody,
    Button,
    TableHead,
    Checkbox,
    Search,
} from "@carbon/react";
import "../../Style.css";
import React, {useState, useEffect, useRef} from "react";

import {FormattedMessage, useIntl} from "react-intl";
import {getFromOpenElisServer, Roles} from "../../utils/Utils";
import CustomDatePicker from "../../common/CustomDatePicker";
import {format} from "date-fns";
import {DatePicker, DatePickerInput} from "@carbon/react";
import AutoComplete from "../../common/AutoComplete";

const DispatchReport = ({id}) => {
    const componentMounted = useRef(false);
    const intl = useIntl();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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

    const getTestSections = (fetchedTestSections, defaultSecId) => {
        if (componentMounted.current) {
            let testSection = fetchedTestSections.find((testSection) => testSection.id === defaultSecId);
            let testSectionLabel = testSection ? testSection.value : intl.formatMessage({ id: "input.placeholder.selectTestSection" });
            setDefaultTestSectionId(defaultSecId);
            setDefaultTestSectionLabel(testSectionLabel);
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
        {key: "resultDate", header: <FormattedMessage id="referral.search.column.resultDate"/>},
        {key: "labNumber", header: <FormattedMessage id="quick.entry.accession.number"/>},
        {key: "unit", header: <FormattedMessage id="field.testUnit"/>}
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

        let testSectionId = new URLSearchParams(window.location.search).get("testSectionId");
        testSectionId = testSectionId ? testSectionId : "";

        getFromOpenElisServer("/rest/site-names", getSites);
        getFromOpenElisServer("/rest/user-test-sections/" + Roles.RESULTS, (resp) => getTestSections(resp, testSectionId));

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
            showPrinted: showPrinted,
            selectedSiteId: selectedSiteId
        });
        console.log(params.toString())
        getFromOpenElisServer(
            "/rest/ElectronicOrders?" + params.toString(),
            loadData,
        );
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
                        id="test-unit-id"
                        labelText={intl.formatMessage({id: "field.testUnit"})}
                        value={""}
                        onChange={(e) => {
                            setDefaultTestSectionId(e.target.value);
                            setDefaultTestSectionLabel(e.target.selectedOptions[0].text);
                        }}>
                        <SelectItem text={defaultTestSectionLabel} value={defaultTestSectionId}/>
                        {testSections
                            .filter((item) => item.id !== defaultTestSectionId)
                            .map((item, idx) => {
                                return (
                                    <SelectItem key={idx} text={item.value} value={item.id} />
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
                    <CustomDatePicker
                        id={"start-date-id"}
                        labelText={intl.formatMessage({id: "eorder.date.start"})}
                        value={new Date().setDate(new Date().getDate() - 7)}
                        autofillDate={true}
                        disallowFutureDate={true}
                        onChange={(date) => setStartDate(date)}
                    />
                </Column>

                <Column lg={2}>
                    <div>
                        <DatePicker datePickerType="single" dateFormat="d-m-Y" size="md" value={new Date()}
                            maxDate={format(new Date().setDate(new Date().getDate() + 1), 'dd/MM/yyyy')}
                            onChange={(date) => setEndDate(date)}>
                            <DatePickerInput id="date-picker-input-id-start" placeholder="dd/mm/yyyy"
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

                <Column lg={3}>
                    <div className="bottomAlign">
                        <Search value={""} labelText="" placeholder="Accession No or Patient Name"/>
                    </div>
                </Column>

                <Column lg={16}><br/></Column>

                <Column lg={16}>
                    <DataTable rows={data ?? []} headers={reportHeaders} isSortable>
                        {({rows, headers, getHeaderProps, getTableProps}) => (
                            <Table {...getTableProps()}>
                                <TableHead>
                                    <TableRow>
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
                                        .map((row) => (
                                            <TableRow key={row.id}>
                                                {row.cells.map((cell) => (
                                                    <TableCell key={cell.id}>{cell.value}</TableCell>
                                                ))}
                                                <TableCell>
                                                    <Button onClick={""} size="sm" kind="tertiary">Print</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        )}
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
