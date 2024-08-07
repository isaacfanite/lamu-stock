import { Box, Flex, Text, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue, Input, Button, Stack } from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  PaginationState
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import * as React from 'react';

type RowObj = {
  id: number;
  artno: string;
  barcode: string;
  product_name: string;
  category: string;
  product_group: string;
  package_size: string;
};

const columnHelper = createColumnHelper<RowObj>();

export default function ComplexTable() {
  const [tableData, setTableData] = React.useState<RowObj[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredData, setFilteredData] = React.useState<RowObj[]>([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  React.useEffect(() => {
    fetch('| https://lm.fanitehub.com/products')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data); // Debugging line
        setTableData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Filtering data based on search term
  React.useEffect(() => {
    const filtered = tableData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, tableData]);

  const columns = [
    columnHelper.accessor('artno', {
      id: 'artno',
      header: () => (
        <Text
          justifyContent='space-between'
          align='center'
          fontSize={{ sm: '10px', lg: '12px' }}
          color='gray.400'>
          ART NO
        </Text>
      ),
      cell: ({ value }: { value: string }) => (
        <Flex align='center'>
          <Text color={textColor} fontSize='sm' fontWeight='700'>
            {value}
          </Text>
        </Flex>
      )
    }),
    columnHelper.accessor('product_name', {
      id: 'product_name',
      header: () => (
        <Text
          justifyContent='space-between'
          align='center'
          fontSize={{ sm: '10px', lg: '12px' }}
          color='gray.400'>
          PRODUCT NAME
        </Text>
      ),
      cell: ({ value }: { value: string }) => (
        <Flex align='center'>
          <Text color={textColor} fontSize='sm' fontWeight='700'>
            {value}
          </Text>
        </Flex>
      )
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: () => (
        <Text
          justifyContent='space-between'
          align='center'
          fontSize={{ sm: '10px', lg: '12px' }}
          color='gray.400'>
          CATEGORY
        </Text>
      ),
      cell: ({ value }: { value: string }) => (
        <Flex align='center'>
          <Text color={textColor} fontSize='sm' fontWeight='700'>
            {value}
          </Text>
        </Flex>
      )
    }),
    columnHelper.accessor('package_size', {
      id: 'package_size',
      header: () => (
        <Text
          justifyContent='space-between'
          align='center'
          fontSize={{ sm: '10px', lg: '12px' }}
          color='gray.400'>
          PACKAGE SIZE
        </Text>
      ),
      cell: ({ value }: { value: string }) => (
        <Text color={textColor} fontSize='sm' fontWeight='700'>
          {value}
        </Text>
      )
    })
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });

  return (
    <Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
          Product Master List
        </Text>
        <Menu />
      </Flex>
      <Box px='25px' mb='20px'>
        <Stack spacing={4}>
          <Input
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Stack>
      </Box>
      <Box>
        <Table variant='simple' color='gray.500' mb='24px' mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe='10px'
                    borderColor={borderColor}
                    cursor='pointer'
                    onClick={header.column.getToggleSortingHandler()}>
                    <Flex
                      justifyContent='space-between'
                      align='center'
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color='gray.400'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '▲',
                        desc: '▼',
                      }[header.column.getIsSorted() as string] ?? null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor='transparent'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Flex justifyContent='space-between' align='center' px='25px' mt='4'>
          <Text>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Text>
          <Flex>
            <Button
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
              mr='2'>
              Previous
            </Button>
            <Button
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}>
              Next
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Card>
  );
}
