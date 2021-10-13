import { useState } from 'react';
import {
  Box,
  Text,
  Divider,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Table,
  Thead,
  Tr,
  Th,
  chakra,
  Tbody,
  Td,
  Flex,
  Stack,
  Select,
} from '@chakra-ui/react';
import {
  TriangleDownIcon,
  TriangleUpIcon,
  Search2Icon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
} from '@chakra-ui/icons';
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useAsyncDebounce,
} from 'react-table';
import XLSX from 'xlsx';

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, rows }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  const exportData = () => {
    var tbl = document.getElementById('tableReact');
    const wsAll = XLSX.utils.table_to_sheet(tbl);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsAll, 'ExportSheet');
    XLSX.writeFile(wb, `export-sheet.xlsx`, { bookType: 'xlsx' });
  };

  return (
    <>
      <Text mb="8px">Buscar:</Text>
      <InputGroup mb="30px">
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
          children={<Search2Icon />}
        />
        <Input
          placeholder={`${count} registros...`}
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
        <IconButton
          ml="8px"
          colorScheme="brand"
          aria-label="Search database"
          icon={<DownloadIcon />}
          onClick={() => exportData(rows)}
        />
      </InputGroup>
    </>
  );
}

const TableSearch = ({ data, columns, overflow }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  return (
    <>
      <Divider mt="30px" mb="30px" borderBottomWidth={3} borderColor="brand.500" />
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        rows={rows}
      />
      <Table
        {...getTableProps()}
        variant="striped"
        colorScheme="gray"
        id="tableReact"
        style={
          overflow
            ? {
                maxWidth: '1210px',
                width: '1210px',
                display: 'block',
                overflowX: 'auto',
              }
            : null
        }>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={column.isNumeric}>
                  {column.render('Header')}
                  <chakra.span pl="4">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                    style={cell.column.style}>
                    <Text>{cell.render('Cell')}</Text>
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Flex flexDirection="row" justifyContent="center" alignItems="center" pt={4}>
        <Flex flex={1} alignItems="center">
          <IconButton
            variant="outline"
            colorScheme="gray"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<ArrowLeftIcon />}
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
            mr="8px"
          />
          <IconButton
            variant="outline"
            colorScheme="gray"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<ChevronLeftIcon />}
            onClick={() => previousPage()}
            isDisabled={!canPreviousPage}
            mr="8px"
          />
          <IconButton
            variant="outline"
            colorScheme="gray"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<ChevronRightIcon />}
            onClick={() => nextPage()}
            isDisabled={!canNextPage}
            mr="8px"
          />
          <IconButton
            variant="outline"
            colorScheme="gray"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<ArrowRightIcon />}
            onClick={() => gotoPage(pageCount - 1)}
            isDisabled={!canNextPage}
            mr="16px"
          />
          <Box as="span">
            Page{' '}
            <Box as="strong">
              {pageIndex + 1} of {pageOptions.length}
            </Box>{' '}
          </Box>
        </Flex>

        <Stack spacing={3}>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </Select>
        </Stack>
      </Flex>
    </>
  );
};

export default TableSearch;
