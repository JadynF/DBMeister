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
      <div className="w-[400px] border-2 border-blue-700 bg-indigo-400 rounded-xl border-rounded-xl">
        <Handle type="target" position={Position.Top} style={{top: '-4px', width: '8px', height: '8px'}}/>
        <div>
            <Table className='text-left'>
                <TableHeader>
                    {<TableRow className="font-mono text-lg">
                        <TableHead></TableHead> {/* Spacer. DO NOT REMOVE */}
                        <TableHead className="text-white">{tableHeader}</TableHead>
                        <TableHead className='align-right text-right text-white'>ID: {tableID}</TableHead>
                        <TableHead></TableHead> {/* Spacer. DO NOT REMOVE */}
                    </TableRow>}
                </TableHeader>
                <TableBody className='text-left'>
                    {tableData.map((row) => (
                    <TableRow key={row.fieldName} className="relative font-mono text-lg">
                        <td>
                            <Handle type="target" position={Position.Left} id={`row-${row.fieldName}-t`} className='border-t border-b border-white' style={{position: 'absolute', left: '8px', width: '8px', height: '8px'}}/>
                        </td>
                        <TableCell className="text-left pl-2 border-t border-b border-white text-black">{row.fieldName}</TableCell>
                        <TableCell className="text-right text-black gap-5px">{row.fieldType}</TableCell>
                        <td>
                            <Handle type="source" position={Position.Right} id={`row-${row.fieldName}-s`} className='border-t border-b border-white' style={{position: 'absolute', right: '8px', width: '8px', height: '8px'}}/>
                        </td>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        <Handle type="source" position={Position.Bottom} style={{bottom: '-4px', width: '8px', height: '8px'}}id="a" />
      </div>
    );
}

export default SQLTableNode;