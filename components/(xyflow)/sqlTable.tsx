'use client';
import { Handle, Position } from '@xyflow/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

type SQLTableDataType = {
    fieldName: string,
    fieldType: string,
    nullability: boolean,
    keyType: string | null,
    unique: boolean,
    check: string | null,
    indexing: string | null,
    comments: string | null
}
type SQLTableType = {
    id: string,
    header: string,
    tableData: SQLTableDataType[]
}
const defaultTable: SQLTableDataType[] = [
    {fieldName: 'Field1', fieldType: 'VARCHAR(55)', nullability: true, keyType: 'PRIMARY', unique: true, check: null, indexing: null, comments: 'Default Comment 1'},
    {fieldName: 'Field2', fieldType: 'INT(8)', nullability: true, keyType: null, unique: false, check: null, indexing: null, comments: 'Default Comment 2'},
    {fieldName: 'Field3', fieldType: 'VARCHAR(8)', nullability: true, keyType: null, unique: false, check: null, indexing: null, comments: 'Default Comment 3'},
];

const SQLTableNode = ({data}: {data: SQLTableType}) => {
    const tableData = data.tableData || defaultTable;
    const tableHeader = data.header || "MyTable";
    const tableID = data.id || `${data.tableData.length + 1}`;

    return (
      <div style={{width: 400}}>
        <Handle type="target" position={Position.Top} style={{top: '-4px'}}/>
        <div>
            <Table className='bg-indigo-300 rounded-xl border-rounded-xl text-left'>
                <TableHeader className="w-[300px]">
                    {<TableRow>
                        <TableHead>{tableHeader}</TableHead>
                        <TableHead className='align-right text-right'>({tableID})</TableHead>
                    </TableRow>}
                </TableHeader>
                <TableBody className='text-left'>
                    {tableData.map((row) => (
                    <TableRow key={row.fieldName} className="relative">
                        <td>
                            <Handle type="target" position={Position.Left} id={`row-${row.fieldName}-t`} style={{position: 'absolute', left: '4px'}}/>
                        </td>
                        <TableCell className="text-left">{row.fieldName}</TableCell>
                        <TableCell className="text-right gap-5px">{row.fieldType}</TableCell>
                        <td>
                            <Handle type="source" position={Position.Right} id={`row-${row.fieldName}-s`} style={{position: 'absolute', right: '4px'}}/>
                        </td>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <Handle type="source" position={Position.Bottom} style={{bottom: '-4px'}}id="a" />
      </div>
    );
}

export default SQLTableNode;